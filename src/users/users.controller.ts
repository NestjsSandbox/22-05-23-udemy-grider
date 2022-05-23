import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create.user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update.user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private userService: UsersService,
        private authService: AuthService
        ){}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto){
        return this.authService.signup(body.email, body.password);
        //console.log('The body content is : ', body);
        // 2022-05-23-0628 this.userService.create(body.email, body.password);
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
