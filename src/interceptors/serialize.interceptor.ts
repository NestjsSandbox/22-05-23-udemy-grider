import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";


interface ClassConstructor{
    new ( ...args: any[] ) : {}
}


export function Serialize(dto: ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor{
   
   constructor (private dto : any){}
   
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        
        //Run before the request is prvco
       // console.log('This is run before the request reaches the request'); //, context

        return next.handle().pipe(
            map((data : any) => {
                //running before the responce is set back
                //console.log('This is run before the request reaches the request'); //,data

                return plainToInstance(this.dto, data, {excludeExtraneousValues: true,});
            }),
        );
    }
}