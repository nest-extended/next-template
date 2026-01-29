import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VersionController } from './version.controller';

@Module({
  imports: [],
  controllers: [VersionController],
  providers: [],
})
export class VersionModule {}
