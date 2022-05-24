import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create.user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update.user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private userService: UsersService,
        private authService: AuthService
        ){}


    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return(user);
    }


    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any){
        const user =  await this.authService.signup(body.email, body.password);
        console.log(`user = `, user);
        session.userId = user.id;
        return user;
        //console.log('The body content is : ', body);
        // 2022-05-23-0628 this.userService.create(body.email, body.password);
    }

    @Get('/signout')
    signOut(@Session() session: any){
       // console.log(`Signing out of user = `, session.userId);

        session.userId = null;
    }

    @Get('/whoami2')
    whoAmI2(@Session() session: any, @CurrentUser() user: User){
        return user;
    }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@Session() session: any, @CurrentUser() user: string){
        console.log(`session.userId = ${session.userId}`);
        
        if (!session.userId){
            console.log('No user is logged in.');
            return null;
        }
        return this.userService.findOne(session.userId);
    }


    @Get('/:id')
    async findUser(@Param('id') idString: string ){
        const user = await this.userService.findOne(parseInt(idString));
        if (!user) {
            throw new NotFoundException(`Did not find user id=${idString}.` );
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.userService.find(email);
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.userService.update(parseInt(id), body);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        return this.userService.remove(parseInt(id));
    }
}
