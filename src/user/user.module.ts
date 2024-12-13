import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { RedisModule } from "../redis/redis.module"; // Импортируем RedisModule

@Module({
  imports: [RedisModule], // Добавляем RedisModule
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
