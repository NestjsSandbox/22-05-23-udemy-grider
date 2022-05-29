import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {AuthService} from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('==== AuthService being tested ====', () => {

let service: AuthService;
let fakeUsersService: Partial<UsersService>;

beforeEach(async () => {

    fakeUsersService = 
    {
        find: () => Promise.resolve([]),

        create: (email: string, password: string) => 
                            Promise.resolve({id: 1, email, password} as User),
        //The type returned by "UsersService.create" is a Promise<User> and that is what is also returned in this fake create function.
    }

    const module = await Test.createTestingModule({
        providers: [
            AuthService,
            {
                provide: UsersService,
                useValue: fakeUsersService
            }
        ]
    }).compile(); 

    service = module.get(AuthService);

});

//-----------------
it ('can create an instance of an auth service', async() => {
    expect(service).toBeDefined();
});

//-----------------
it ('can signup : create a new user given an email with a salted & hashed password', async () => {
    const user = await service.signup('me@email.com','lala');
    //FYI: the password "lala" will be salted & hashed then concatenated as salt.hash so for sure it wont be "lala". So all we can test for success is that it does not equal to "lala"

    //First expect password is changed to something ales than "lala":
    expect(user.password).not.toEqual('lala');
    //Second test there is a salt value split by a dot from the salt.hash
    const [salt,hash] = user.password.split('.');
    expect(salt).toBeDefined();
    //Third test there is a hash value split by a dot from the salt.hash
    expect(hash).toBeDefined();
});

//---------
it ('throws an error if the signup user email already exists',
        async  () => {

            //First we redefine the find method so that it returns something other than an empty array. The find method in the beforeEach returns an empty aray but we need the array returned to have at least one User object so that the signup will throw an error thus simulating a case where at least one user with same email already exists.
            fakeUsersService.find = () => 
                Promise.resolve([{id: 1, email: 'a', password: 'b'} as User]);

            //The we use the await on the expect function together with 'rejects.toThrow' options
            await expect(service.signin("me@email.com", "lala"))
                .rejects
                .toThrow( BadRequestException );
            
        }
   );

}); //end of describe AuthService