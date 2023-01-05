import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AUTH_TYPE_KEY } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthTypeEnum } from 'src/iam/authentication/enums/auth-type.enum';
import { AccessTokenGuard } from 'src/iam/authentication/guards/access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthTypeEnum.Bearer;
  private readonly authTypeGuardMap: Record<
    AuthTypeEnum,
    CanActivate | CanActivate[]
  > = {
    [AuthTypeEnum.Bearer]: this.accessTokenGuard,
    [AuthTypeEnum.None]: { canActivate: () => true },
  };
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthTypeEnum[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    let error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((e) => {
        error = e;
      });
      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
