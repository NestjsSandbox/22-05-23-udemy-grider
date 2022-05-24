import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(

    (data: never, context: ExecutionContext) => {

        const request = context.switchToHttp().getRequest();

        const resultCurrentUser = request.currentUser;
        console.log('[current-user.decorator] Current user is = ', resultCurrentUser);
        
        return resultCurrentUser;

    }
);