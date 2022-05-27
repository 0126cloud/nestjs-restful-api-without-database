import { Controller, Get, Request } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  async getRoutes(@Request() req: any) {
    const router: { stack: [] } = req.app._router;
    return {
      routes: router.stack
        .map((layer: any) => {
          if (layer.route) {
            const path = layer.route?.path;
            const method = layer.route?.stack[0].method;
            return `${method.toUpperCase()} ${path}`;
          }
        })
        .filter((item) => item !== undefined),
    };
  }
}
