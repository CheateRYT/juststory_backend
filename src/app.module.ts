import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AiModule } from "./ai/ai.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SubscriptionCheckerModule } from "./subscription-checker/subscription-checker.module";
import { SubscriptionModule } from "./subscription/subscription.module";
import { UserModule } from "./user/user.module";
import { RedisModule } from "./redis/redis.module"; // Импортируем RedisModule
//import { PrometheusModule } from "@willsoto/nestjs-prometheus";
@Module({
  imports: [
    AiModule,
    ConfigModule.forRoot(),
    UserModule,
    SubscriptionModule,
    SubscriptionCheckerModule,
    RedisModule,
    // PrometheusModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
