import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AiModule } from './ai/ai.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
@Module({
	imports: [AiModule, ConfigModule.forRoot(), UserModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
