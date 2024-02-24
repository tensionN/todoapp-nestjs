import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { UserService } from "../user/user.service";

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`,
    });

    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;
    const text = `Welcome to the application. To confirm email address, click here: ${url}`;
    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }

  public async confirmEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user.isMailConfirmed) {
      throw new BadRequestException('Email already confirm');
    }
    await this.userService.markMailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
    } catch(error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async resendConfirmationLink(userId: number) {
    const user = await this.userService.findOne(userId);
    if (user.isMailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }
}
