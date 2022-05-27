import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('root')
@Controller('')
export class AppController {
  @Get()
  async getRoutes() {
    return {
      title: 'NTU Cool Interview',
      message: 'go to /api to use open api',
      sincerely: 'Thank you',
    };
  }
}
