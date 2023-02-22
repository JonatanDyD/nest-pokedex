import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsPositive, IsString, Min, MinLength } from 'class-validator';
import { CreatePokemonDto } from './create-pokemon.dto';

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {


    @IsInt()
    @IsPositive()
    @Min(1)
    @IsOptional()
    no: number;

    @IsString ()
    @MinLength(1)
    @IsOptional()
    name: string;
}
