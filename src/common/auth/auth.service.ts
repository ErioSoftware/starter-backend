import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(name: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByName(name);
    if (user && (await user.checkPassword(pass)) && user.active) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      name: user.name,
      id: user.id,
      role: user.role,
      active: user.active,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
