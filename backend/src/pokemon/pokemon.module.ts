import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { PokemonGateway } from './pokemon.gateway';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [PokemonController],
  providers: [PokemonService, PokemonGateway],
  exports: [PokemonService],
})
export class PokemonModule {}