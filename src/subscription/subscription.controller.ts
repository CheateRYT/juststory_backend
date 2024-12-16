import { Body, Controller, Get, Param, Post, Request } from "@nestjs/common";
import { UserService } from "src/user/user.service"; // Импортируем UserService
import { SubscriptionService } from "./subscription.service";

@Controller("subscription")
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService // Добавляем UserService
  ) {}

  @Get(":id")
  async getSubscription(@Param("id") id: number) {
    return this.subscriptionService.getSubscriptionById(Number(id));
  }

  @Get()
  async getSubscriptions() {
    return this.subscriptionService.getSubscriptions();
  }

  @Post("update/:id")
  async updateSubscription(
    @Param("id") id: number,
    @Body() data: any,
    @Request() req
  ) {
    const token = req.headers.authorization?.split(" ")[1]; // Извлекаем токен из заголовка
    return this.subscriptionService.updateSubscription(Number(id), data, token);
  }

  @Post("purchase/:id")
  async purchaseSubscription(
    @Param("id") subscriptionId: number,
    @Request() req
  ) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Токен не предоставлен");
    }
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    return this.subscriptionService.purchaseSubscription(
      user,
      Number(subscriptionId),
      token
    );
  }
}
