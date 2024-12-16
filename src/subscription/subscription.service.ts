import { Injectable, OnModuleInit, Inject } from "@nestjs/common";
import { Subscription, User } from "@prisma/client";
import Redis from "ioredis";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class SubscriptionService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    @Inject("REDIS_CLIENT") private readonly redis: Redis
  ) {}

  async onModuleInit() {
    await this.createDefaultSubscription();
  }

  async createDefaultSubscription() {
    const existingSubscription = await this.prisma.subscription.findFirst({
      where: { name: "Начитанный" },
    });

    if (!existingSubscription) {
      await this.prisma.subscription.create({
        data: {
          name: "Начитанный",
          description: "Полное отсутствие рекламы. + 10 к карме",
          price: "300",
          daysPeriod: 30,
        },
      });
      console.log("Default subscription created.");
    }
  }

  async getSubscriptionById(id: number) {
    const cachedSubscription = await this.redis.get(`subscription:${id}`);
    if (cachedSubscription) {
      return JSON.parse(cachedSubscription);
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (subscription) {
      // Кэшируем подписку на 1 час
      await this.redis.set(
        `subscription:${id}`,
        JSON.stringify(subscription),
        "EX",
        3600
      );
    }
    return subscription;
  }

  async getSubscriptions() {
    return this.prisma.subscription.findMany();
  }

  async updateSubscription(
    id: number,
    data: Partial<Subscription>,
    token: string
  ) {
    const userRole = await this.userService.getUserRoleByToken(token);
    if (userRole !== "Admin") {
      throw new Error("Доступ запрещен"); // Проверка роли
    }
    return this.prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async purchaseSubscription(
    user: User,
    subscriptionId: number,
    token: string
  ) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });
    if (!subscription) {
      throw new Error("Подписка не найдена");
    }

    const now = new Date();
    const endTime = new Date(now);
    endTime.setDate(now.getDate() + subscription.daysPeriod);
    await this.redis.del(`user:${token}`);
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        subscription: true,
        subBuyTime: now,
        subEndTime: endTime,
      },
    });
  }
}
