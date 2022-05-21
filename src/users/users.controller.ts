import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
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

    @Get('/:id')
    async findUser(@Param('id') idString: string ){
        const user = await this.userService.findOne(parseInt(idString));
        if (!user) {
            throw new NotFoundException(`Did not find user id=${idString}.` );
        }
        return user;
    }

}
