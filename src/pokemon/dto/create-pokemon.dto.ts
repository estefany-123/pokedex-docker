import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    @IsString({message: "El campo name debe ser un string"})
    @MinLength(2)
    name: string;
}
