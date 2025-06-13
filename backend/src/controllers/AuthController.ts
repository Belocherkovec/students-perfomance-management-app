import { Body, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';

import { ILoginResponse } from '@/interfaces';
import { AuthService } from '@/services';

@JsonController('/login')
@Service()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(@Body() data: { login: string; password: string }): Promise<ILoginResponse> {
    return this.authService.login(data.login, data.password);
  }

  @Post('/refresh')
  async refreshToken(@Body() data: { refreshToken: string }): Promise<{ accessToken: string }> {
    return this.authService.refreshAccessToken(data.refreshToken);
  }
}
