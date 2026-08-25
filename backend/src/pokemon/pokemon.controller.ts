import { Controller, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('pokemon')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }

  @Get()
  @ApiOperation({ summary: 'Get all stored pokemons for current user' })
  @ApiResponse({ status: 200, description: 'Returns list of user pokemons.' })
  findAll(@Request() req: any) {
    return this.pokemonService.findAll(req.user.id);
  }

  @Get('random')
  @ApiOperation({ summary: 'Get a random pokemon sprite' })
  @ApiResponse({ status: 200, description: 'Returns random pokemon sprite.' })
  async getRandom(@Request() req: any) {
    return this.pokemonService.getRandomSprite(req.user.id);
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete all pokemons for current user' })
  @ApiResponse({ status: 200, description: 'All user pokemons deleted.' })
  removeAll(@Request() req: any) {
    return this.pokemonService.removeAll(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pokemon sprite' })
  @ApiResponse({ status: 200, description: 'Pokemon sprite deleted.' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.pokemonService.remove(req.user.id, +id);
  }
}
