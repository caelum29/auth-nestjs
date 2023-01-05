import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from 'src/iam/authentication/authentication.service';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { RefreshTokenDto } from 'src/iam/authentication/dto/refresh-token.dto';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto';
import { SignInDto } from 'src/iam/authentication/dto/sign-in.dto';
import { Response } from 'express';
import { AuthTypeEnum } from 'src/iam/authentication/enums/auth-type.enum';

@Auth(AuthTypeEnum.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(signInDto);
    // res.cookie('access_token', accessToken, {
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: true,
    // });
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
