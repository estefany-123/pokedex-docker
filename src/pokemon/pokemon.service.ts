import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try{
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    }
    catch(error){
      if(error.code === 11000){
        throw new BadRequestException(`El Pokemon existe en la db ${JSON.stringify(error.keyValue)}`)
      }
      console.log(error);
      throw new InternalServerErrorException(`No se puede crear un pokemon - revise el log`)
    }
  }

  async findAll() {
    const pokemons = await this.pokemonModel.find();
    return pokemons;
  }

  async findOne(id: string) {
    const pokemon = await this.pokemonModel.findById(id);
    if(!pokemon) throw new NotFoundException(`No se encuentra un pokémon con el id ${id}`);
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      const updatedPokemon = await this.pokemonModel.findByIdAndUpdate(
        id,
        updatePokemonDto,
        { new: true, runValidators: true },
      );

      if (!updatedPokemon) {
        throw new NotFoundException(
          `No se encontró un Pokémon con el ID ${id}`,
        );
      }

      return updatedPokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `El Pokémon con esos datos ya existe: ${JSON.stringify(error.keyValue)}`,
        );
      }
      console.error(error);
      throw new InternalServerErrorException(
        'No se pudo actualizar el Pokémon - revise el log',
      );
    }
  }

  async remove(id: string) {

    const deleted = await this.pokemonModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`No se encontró un Pokémon con el ID ${id}`);
    }

    return {
      message: `El Pokémon con ID ${id} fue eliminado exitosamente`,
      deletedPokemon: deleted,
    };
  }
}
