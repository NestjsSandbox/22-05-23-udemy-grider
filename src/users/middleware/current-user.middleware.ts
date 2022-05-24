import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request,
        Response,
        NextFunction } from "express";
import { User } from "../users.entity";
import { UsersService } from "../users.service";

//The following 'declare' adds the property 'currentUser' to the request since its
// a custom property an doesnt exist by default making TS react with an error.
//After this declare TS wwill see this value as an optional and legal property.
declare global {
    namespace Express{
        interface Request{
            currentUser?: User;
        }
    }
}


@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{

    constructor(private usersService: UsersService){};

    async use(req: Request, res: Response, next: NextFunction){
        
        const {userId} = req.session || {};

        if (userId) { 
            const user = await this.usersService.findOne(userId);
            
            req.currentUser=user;
        }

        next(); //we announce we are done with this middleware and tell the runtime to continue to whatever middleware is next.
    }

}