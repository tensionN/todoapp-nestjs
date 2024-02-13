import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtRefreshTokenStrategy } from "./strategy/jwt-refresh-token.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(),
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    JwtRefreshTokenStrategy,
    JwtStrategy,
    RefreshTokenIdsStorage,
    ConfigService
  ],
  controllers: [AuthController],
})
export class AuthModule {}
