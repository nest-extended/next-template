import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('version')
export class VersionController {
  constructor() {}

  @Get()
  sendVersion() {
    return {
      androidVersion: '1.0.0',
      isAndroidUnderMaintenance: false,
      iosVersion: '1.0.0',
      isIosUnderMaintenance: false,
    };
  }
}
