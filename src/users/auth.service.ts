import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";

@Injectable()
export class AuthService{
    constructor(private userService: UsersService){}

    async signup(email: string, password: string){
    
        const user= await this.userService.find(email);

        if (user.length){ //if the list isnt empty then at least 1 email already exists in db
            throw new BadRequestException(`The email named "${email}" already exists in db` );
        }

    }
}