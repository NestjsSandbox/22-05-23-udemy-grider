import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {AuthService} from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('\n ==== AuthService being tested ====', () => {

let service: AuthService;
let fakeUsersService: Partial<UsersService>;

beforeEach(async () => {

    //We create an empty array of User objects, this will live in the runtime memory
    const users: User[] = []; 

    fakeUsersService = 
    {
        find: (email: string) => {
            //Here we filter the runtime-memory 'users' array for all objects where the 
            //input email is equivalent to that object's email property.
            const filteredUsers = users.filter( user => user.email === email);

            //This returns an array of User objects who all have same email property value.
            return Promise.resolve(filteredUsers);
        },

        create: (email: string, password: string) => {
            //Here we randonly pick 1 in a million numbers thus mimicking a unique number 
            const mockUniqueNumber = Math.floor(Math.random() * 999999);

            //Here we create the mock user
            const user = {
                id: mockUniqueNumber, 
                email,
                password,
            } as User;

            //Here we add the newly created mock user to the runtime-memory users list
            users.push(user);

            return Promise.resolve(user);
        //The type returned by the real "UsersService.create" is a Promise<User> and that is also what we return here to mimick the real UserService , a Promise of a User type.

        }

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

}); //end of beforeEach

describe('\n   --- Testing signup ---', () => {


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

}); //end --- Testing signup ---

describe('\n   --- Testing signin ---', () => {

    it ('throws if signin is called with email that is not in db', async () => {

        //We dont need to overload fakeUsersService.find because if user is not in db then the real UsersService.find would return an empty array, and that is what the default 'beforeEach' version is assigned to return.

        await expect(service.signin("x", "lala"))
        .rejects
        .toThrow( NotFoundException );
    });

    it ('it throws if an invalid password is given', async () => {

        fakeUsersService.find = () => 
        Promise.resolve([{email: 'a', password: 'b'} as User]);

        //No matter what value we use in the signin arguments, the result is always succes for the email and fail for the password (we want it to fail for the password).
        //The reason regarding the 'email' is that the find doesnt care about the value content, only that a value exists.
        //The reason the password will always fail is that the password is salt.hash and we cant just guess it.
        await expect(service.signin("anything", "someSalt.someHash"))
        .rejects
        //.toThrow( NotFoundException );  //You can verify if the test works by uncommeting this
        .toThrow( BadRequestException );  

    });

    it ('it returns a user if a valid password is given', async () => {

        await service.signup('tst1@email.com','tst1pswrd');

        const user = await service.signin('tst1@email.com','tst1pswrd');
        
        expect(user).toBeDefined();

    });


});//end --- Testing signin ---

}); //end of describe AuthService