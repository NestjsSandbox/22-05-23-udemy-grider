import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto{

    @IsOptional()
    @IsEmail()
    "email": string;

    @IsOptional()
    @IsString()
    "password": string;
}