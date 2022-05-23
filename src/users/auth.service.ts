import { BadRequestException, Injectable } from "@nestjs/common";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";

const promisfyScrypt = promisify(scrypt);

@Injectable()
export class AuthService{
    constructor(private userService: UsersService){}

    async signup(email: string, password: string){
    
        const user= await this.userService.find(email);

        console.log(`Found user with user=`,user);

        if (user.length){ //if the list isnt empty then at least 1 email already exists in db
            throw new BadRequestException(`The email named "${email}" already exists in db` );
        }

        //If runtime got to this line then the email is not in db so Green-light to signup the new user
        console.log(`Email "${email}" approved for the signup process, starting signup...`);

        //### Now we need to prep the password before saving it to the db 
        //Step-1 is to create the salt
        const salt = randomBytes(8).toString('hex');

        //Step-2 is to hash together the password and salt to one hash string
        const hash = (await promisfyScrypt(password, salt, 32)) as Buffer;

        //Step-3 concatenate the salt and the hash with a sperator and save to db
        const encryptPassword = salt + "." + hash.toString('hex');


        //### Now that the password is ready we can create & save the new user in db
        const signableUser = this.userService.create(email, encryptPassword);

        console.log(`The signup processEmail for email "${email}" completed. Welcome new user. `);


        return signableUser;


    }
}