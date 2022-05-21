import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create.user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {

    constructor(private userService: UsersService){}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto){
        //console.log('The body content is : ', body);
        this.userService.create(body.email, body.password);
    }
}
