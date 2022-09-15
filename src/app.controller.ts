import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiTags('Health')
  @Get('/ping')
  async ping() {
    return { status: 'OK' };
  }
}
