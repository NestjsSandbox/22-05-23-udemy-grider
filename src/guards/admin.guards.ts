import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean  {
        
        const request = context.switchToHttp().getRequest();

        if (!request.currentUser){ //If no user is signed in
            return false;
        }

        return request.currentUser.admin; //If value of property admin is true then guard allows request to pass through otherwise it blocks it.

    }
}