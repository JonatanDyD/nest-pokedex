import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  
  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
  ){}
  
  async create(createPokemonDto: CreatePokemonDto) {
    try{
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
    }
    catch(error){
     this.handleExeption(error);
    }
  }

  findAll() {
    return ;
  }

  async findOne(term:  string) {
    let pokemon: Pokemon;

    if( !isNaN(+term) ){
      console.log(!isNaN(+term));
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    if ( isValidObjectId(term)){
      
      pokemon = await this.pokemonModel.findById(term);
    }

    if( !pokemon ){
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()});
    }

    if( !pokemon )
      throw new NotFoundException(`Pokemon with Id name or no ${term} not found`);
    
    return pokemon;
  
  }

  async update(term:  string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    try{
      const updatedPokemon = await pokemon.updateOne(updatePokemonDto, {new: true});
      return {...pokemon.toJSON, ...updatePokemonDto};
    }
    catch(error){
      this.handleExeption(error);
      }
    
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});
     if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with is "${ id }" not found`);
    return ;
  }

  private handleExeption(error: any){

    if (error.code === 11000){
      throw new BadRequestException(`pokemon exists in db ${ JSON.stringify(error.keyValue ) }`)
    }
      throw new InternalServerErrorException();
  }
}
