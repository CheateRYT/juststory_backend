import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AiModule } from './ai/ai.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
@Module({
	imports: [AiModule, ConfigModule.forRoot()],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
