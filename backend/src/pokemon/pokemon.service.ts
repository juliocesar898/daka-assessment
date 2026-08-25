import { Injectable, BadGatewayException, NotFoundException, BadRequestException } from '@nestjs/common';

export interface PokemonSprite {
  id: number;
  url: string;
  name: string;
}

@Injectable()
export class PokemonService {
  private userSprites: Map<number, PokemonSprite[]> = new Map();

  async getRandomSprite(userId: number): Promise<PokemonSprite> {
    const userList = this.userSprites.get(userId) || [];

    if (userList.length >= 30) {
      throw new BadRequestException('Has alcanzado el límite máximo de 30 Pokémon. Elimina alguno para solicitar más.');
    }

    let randomId: number;
    let spriteUrl: string;
    let attempts = 0;
    const maxAttempts = 10;

    // Generar ID evitando que la URL del sprite ya exista en la lista del usuario
    do {
      randomId = Math.floor(Math.random() * 898) + 1;
      spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomId}.png`;
      attempts++;
    } while (userList.some((s) => s.url === spriteUrl) && attempts < maxAttempts);

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

      userList.push(sprite);
      this.userSprites.set(userId, userList);

      return sprite;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadGatewayException('Error al comunicarse con PokeAPI. Intente nuevamente.');
    }
  }

  findAll(userId: number): PokemonSprite[] {
    return this.userSprites.get(userId) || [];
  }

  remove(userId: number, id: number) {
    const userList = this.userSprites.get(userId) || [];
    const index = userList.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Sprite con ID ${id} no encontrado`);
    }
    userList.splice(index, 1);
    this.userSprites.set(userId, userList);
    return { deleted: true, id };
  }

  removeAll(userId: number) {
    const userList = this.userSprites.get(userId) || [];
    const count = userList.length;
    this.userSprites.set(userId, []);
    return { deleted: true, count };
  }
}
