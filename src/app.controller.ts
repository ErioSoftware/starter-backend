import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  UseFilters,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './common/auth/auth.service';
import { LocalAuthGuard } from './common/auth/local/local-auth.guard';
import { Public } from './common/auth/public.decorator';
import { QueryFailedExceptionFilter } from './common/filters/queryFailedExceptionFilter';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';

@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @ApiCreatedResponse()
  @UseFilters(QueryFailedExceptionFilter)
  @Post('auth/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);
    return this.authService.login(newUser);
  }
}
