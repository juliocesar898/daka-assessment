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
      throw new BadRequestException('You have reached the maximum limit of 30 Pokémon. Delete some to request more.');
    }

    const randomId = this.generateUniqueRandomId(userList);

    try {
      const sprite = await this.fetchPokemonSprite(randomId);

      userList.push(sprite);
      this.userSprites.set(userId, userList);

      return sprite;
    } catch (error) {
      throw new BadGatewayException('Error communicating with PokeAPI. Please try again.');
    }
  }

  private generateUniqueRandomId(userList: PokemonSprite[]): number {
    const maxAttempts = 10;
    let attempts = 0;
    let randomId: number;
    let spriteUrl: string;

    do {
      randomId = Math.floor(Math.random() * 898) + 1;
      spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomId}.png`;
      attempts++;
    } while (userList.some((s) => s.url === spriteUrl) && attempts < maxAttempts);

    return randomId;
  }

  private async fetchPokemonSprite(pokemonId: number): Promise<PokemonSprite> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) {
      throw new Error(`PokeAPI status: ${response.status}`);
    }

    const data = await response.json();
    const animatedUrl =
      data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default ||
      data.sprites.front_default;

    return {
      id: Date.now(),
      url: animatedUrl,
      name: data.name,
    };
  }

  findAll(userId: number): PokemonSprite[] {
    return this.userSprites.get(userId) || [];
  }

  remove(userId: number, id: number) {
    const userList = this.userSprites.get(userId) || [];
    const index = userList.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Sprite with ID ${id} not found`);
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
