import { Expose,
        Transform
     } from "class-transformer";

export class ReportDto {
    @Expose()
    id: number;
    
    @Expose()
    make: string;
    
    @Expose()
    model: string;
    
    @Expose()
    year: number;
    
    @Expose()
    milage: number;
    
    @Expose()
    lng: number
    
    @Expose()
    lat: number
    
    @Expose()
    price: number;  

    @Transform( ({obj}) => obj.user.id )
    @Expose()
    userId: number;
    
}

//The DTO enables us to @Exclude properties but also to add new properties by fetching values from the original report object and reforamting their output in the new DTO property using the @Transform decorator.
// The annotation of the @Transform argument reads as follows:

//* (1) Take the original report entity that we're currently trying to format.

//* (2) Look at its user property and look at that users ID.

//* (3) Then take that ID value and assign it to the new 'userId' property.

// Explenation of the syntax:
//  The Transform decorator is going to be called with a function.
//  We put curly-braces inside the function's argument list so that we can destructure the argument list.

// Inside the curly-braces we reference the original report entity with the keyword 'obj'.

// Then we return the value of the id stored in the user of that original report entity user property.
