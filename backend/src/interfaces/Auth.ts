import type { UserDto } from '@/dtos';

export interface ILoginResponse {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}
