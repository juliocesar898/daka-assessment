import { Controller, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { PokemonService } from './pokemon.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@ApiTags('pokemon')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }

  @Get()
  @ApiOperation({ summary: 'Get all stored pokemons' })
  @ApiResponse({ status: 200, description: 'Returns list of user pokemons.' })
  findAll(@Request() req: RequestWithUser) {
    return this.pokemonService.findAll(req.user.id);
  }

  @Get('random')
  @ApiOperation({ summary: 'Get a random pokemon' })
  @ApiResponse({ status: 200, description: 'Returns random pokemon sprite.' })
  async getRandom(@Request() req: RequestWithUser) {
    return this.pokemonService.getRandomSprite(req.user.id);
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete all pokemons' })
  @ApiResponse({ status: 200, description: 'All user pokemons deleted.' })
  removeAll(@Request() req: RequestWithUser) {
    return this.pokemonService.removeAll(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pokemon sprite' })
  @ApiResponse({ status: 200, description: 'Pokemon sprite deleted.' })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.pokemonService.remove(req.user.id, +id);
  }
}
