import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Any } from "typeorm";

export class SerializeInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        
        //Run before the request is prvco
        console.log('This is run before the request reaches the request'); //, context

        return next.handle().pipe(
            map((data : any) => {
                //running before the responce is set back
                console.log('This is run before the request reaches the request'); //,data
            })
        );


    }
}