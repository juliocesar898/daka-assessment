import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PokemonModule } from './pokemon/pokemon.module';
import mikroOrmConfig from './config/mikro-orm.config';

/**
 * AppModule — Módulo raíz de la aplicación
 *
 * ⚠️  TODO (Candidato): La configuración actual usa forRoot() con valores estáticos.
 *     ¿Qué ventaja tendría usar forRootAsync() con ConfigService en su lugar?
 *     Hint: variables de entorno cargadas dinámicamente en runtime vs. build time.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    AuthModule,
    PokemonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

