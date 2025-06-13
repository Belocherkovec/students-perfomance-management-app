import { Body, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';

import { AuthService } from '@/services';

@JsonController('/login')
@Service()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(
    @Body() data: { login: string; password: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(data.login, data.password);
  }

  @Post('/refresh')
  async refreshToken(@Body() data: { refreshToken: string }): Promise<{ accessToken: string }> {
    return this.authService.refreshAccessToken(data.refreshToken);
  }
}
