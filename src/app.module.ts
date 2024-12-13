import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AiModule } from "./ai/ai.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SubscriptionCheckerModule } from "./subscription-checker/subscription-checker.module";
import { SubscriptionModule } from "./subscription/subscription.module";
import { UserModule } from "./user/user.module";
import Redis from "ioredis";

@Module({
  imports: [
    AiModule,
    ConfigModule.forRoot(),
    UserModule,
    SubscriptionModule,
    SubscriptionCheckerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        return new Redis({
          host: "localhost",
          port: 6379,
        });
      },
    },
  ],
})
export class AppModule {}
