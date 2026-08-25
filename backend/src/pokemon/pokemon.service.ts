import { Injectable, BadGatewayException, NotFoundException } from '@nestjs/common';

export interface PokemonSprite {
  id: number;
  url: string;
  name: string;
}

@Injectable()
export class PokemonService {
  private sprites: PokemonSprite[] = [];

  async getRandomSprite(): Promise<PokemonSprite> {
    const randomId = Math.floor(Math.random() * 898) + 1;

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      if (!response.ok) {
        throw new Error(`PokeAPI status: ${response.status}`);
      }

      const data = await response.json();
      const sprite: PokemonSprite = {
        id: Date.now(),
        url: data.sprites.front_default,
        name: data.name,
      };

      this.sprites.push(sprite);
      return sprite;
    } catch (error) {
      throw new BadGatewayException('Error al comunicarse con PokeAPI. Intente nuevamente.');
    }
  }

  findAll(): PokemonSprite[] {
    return this.sprites;
  }

  findOne(id: number): PokemonSprite {
    const sprite = this.sprites.find((s) => s.id === id);
    if (!sprite) {
      throw new NotFoundException(`Sprite con ID ${id} no encontrado`);
    }
    return sprite;
  }

  remove(id: number) {
    const index = this.sprites.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Sprite con ID ${id} no encontrado`);
    }
    this.sprites.splice(index, 1);
    return { deleted: true, id };
  }

  removeAll() {
    const count = this.sprites.length;
    this.sprites = [];
    return { deleted: true, count };
  }
}