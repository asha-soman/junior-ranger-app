import { Module } from '@nestjs/common';
import { AdventuresController } from './adventures.controller';
import { AdventuresService } from './adventures.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [AdventuresController],
    providers: [AdventuresService],
})
export class AdventuresModule { }