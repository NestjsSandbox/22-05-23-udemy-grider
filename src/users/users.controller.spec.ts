import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {

    fakeUsersService = {

      findOne: (id: number) => 
        {return Promise.resolve({ id, email: 'fake@email.com', password:'fakePswrd' } as User)},

      find: (email: string) => 
        {return Promise.resolve([{id: 1, email, password: 'fakePswrd'} as User]) },

      // update: () => {},
      // remove: () => {},
    };

    fakeAuthService = {
      // signin: async () => {},
      // signup: async () => {},
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('method findAllUsers returns array with all users by email', async() => {
    const users = await controller.findAllUsers('my@email.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('my@email.com');

  });

  it ('method findUser return 1 user', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });


  it ('throw error if findUser could not find by given id', async () => {

    fakeUsersService.findOne = () => null;

    await expect(controller.findUser('2'))
    .rejects
    .toThrow( NotFoundException );  
    
  });
});
