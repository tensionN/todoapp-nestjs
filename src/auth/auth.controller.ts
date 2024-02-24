import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from './decorators/public.decorator';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh-token.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { EmailConfirmationService } from "../email/email-confirmation.service";

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Public()
  @Post('sign-up')
  async signup(@Body() registerUserDto: CreateUserDto) {
    const user = this.authService.signUp(registerUserDto);
    await this.emailConfirmationService.sendVerificationLink(
      registerUserDto.email,
    );
    return user;
  }

  @Public()
  @Post('sign-in')
  async signIn(@Body() signInDto: CreateUserDto) {
    this.logger.warn(process.env.JWT_SECRET);
    return this.authService.signIn(signInDto);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req) {
    return this.authService.refreshAccessToken(
      req.headers.authorization.split(' ')[1],
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Headers('authorization') authorization: string) {
    const token = authorization.split(' ')[1];
    await this.authService.logout(token);
    return { message: 'Token invalidated successfully' };
  }
}
