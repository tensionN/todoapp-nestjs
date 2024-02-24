import { Body, ClassSerializerInterceptor, Controller, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { EmailConfirmationService } from "./email-confirmation.service";
import ConfirmEmailDto from "./dto/confirmEmail.dto";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService
  ) {}

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.token);
    await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() request){
    await this.emailConfirmationService.resendConfirmationLink(request.user.id);
  }

}
