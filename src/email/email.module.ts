import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from "@nestjs/jwt";
import { EmailConfirmationService } from "./email-confirmation.service";
import { EmailConfirmationController } from "./email-confirmation.controller";
import { UserService } from "../user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [
    EmailConfirmationController,
  ],
  providers: [
    EmailService,
    JwtService,
    EmailConfirmationService,
    UserService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
