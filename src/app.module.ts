import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AiModule } from './ai/ai.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { SubscriptionModule } from './subscription/subscription.module';
@Module({
	imports: [AiModule, ConfigModule.forRoot(), UserModule, SubscriptionModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
