import { ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage
  ) {}

  async signUp(signUpDto: CreateUserDto) {
    const { email, password } = signUpDto;

    const user = await this.userService.findByEmail(email);

    if (user) {
      throw new ConflictException();
    }

    const newUser = await this.userService.createUser(signUpDto);

    return newUser;
  }

  async signIn(signInDto: CreateUserDto) {
    const { email, password } = signInDto;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordIsValid = await user.validatePassword(password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { id: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    await this.refreshTokenIdsStorage.insert(user.id, refreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      await this.refreshTokenIdsStorage.validate(decoded.id, refreshToken);
      const payload = { id: decoded.id, email: decoded.email };
      const accessToken = await this.jwtService.signAsync(payload);
      return { access_token: accessToken };
    } catch (error) {
      console.log(`Error: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(accessToken: string): Promise<void> {
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken);
      await this.refreshTokenIdsStorage.invalidate(decoded.id);
    } catch (e) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
