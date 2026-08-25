import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PokemonService } from './pokemon.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
})
export class PokemonGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(PokemonGateway.name);

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.auth?.token || client.handshake.headers?.authorization;
      if (!authHeader) {
        client.disconnect();
        return;
      }

      const token = authHeader.replace('Bearer ', '');
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;
      this.logger.log(`Client connected: ${client.id} (User: ${payload.username})`);
    } catch (err) {
      this.logger.error(`Unauthorized connection attempt: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // 🖱️ DISPARADOR MANUAL: Escucha el clic del botón en el frontend
  @SubscribeMessage('request-sprite')
  async handleRequestSprite(client: Socket) {
    try {
      const sprite = await this.pokemonService.getRandomSprite();
      // Emitimos el Pokémon generado de vuelta al cliente
      client.emit('sprite-served', sprite);
    } catch (error) {
      client.emit('pokemon-error', {
        message: (error as Error).message || 'Error al obtener el sprite',
      });
    }
  }

  // 🗑️ DISPARADOR MANUAL: Escucha cuando el frontend borra un sprite
  @SubscribeMessage('delete-sprite')
  handleDeleteSprite(client: Socket, payload: { id: number }) {
    try {
      this.pokemonService.remove(payload.id);
    } catch (error) {
      this.logger.warn(`Sprite no encontrado para eliminar: ${payload.id}`);
    }
  }
}