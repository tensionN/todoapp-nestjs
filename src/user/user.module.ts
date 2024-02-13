import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenIdsStorage } from "../auth/refresh-token-ids-storage.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
  ],
})
export class UserModule {}
