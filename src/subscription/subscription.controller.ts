import { Body, Controller, Get, Param, Post, Request } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { SubscriptionService } from "./subscription.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Subscription")
@Controller("subscription")
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService
  ) {}

  @Get(":id")
  @ApiOperation({ summary: "Получение подписки по ID" })
  @ApiResponse({ status: 200, description: "Подписка успешно получена" })
  @ApiResponse({ status: 404, description: "Подписка не найдена" })
  async getSubscription(@Param("id") id: number) {
    return this.subscriptionService.getSubscriptionById(Number(id));
  }

  @Get()
  @ApiOperation({ summary: "Получение всех подписок" })
  @ApiResponse({ status: 200, description: "Подписки успешно получены" })
  async getSubscriptions() {
    return this.subscriptionService.getSubscriptions();
  }

  @Post("update/:id")
  @ApiOperation({ summary: "Обновление подписки по ID" })
  @ApiResponse({ status: 200, description: "Подписка успешно обновлена" })
  @ApiResponse({ status: 404, description: "Подписка не найдена" })
  async updateSubscription(
    @Param("id") id: number,
    @Body() data: any,
    @Request() req
  ) {
    const token = req.headers.authorization?.split(" ")[1];
    return this.subscriptionService.updateSubscription(Number(id), data, token);
  }

  @Post("purchase/:id")
  @ApiOperation({ summary: "Покупка подписки" })
  @ApiResponse({ status: 200, description: "Подписка успешно куплена" })
  @ApiResponse({ status: 401, description: "Токен не предоставлен" })
  @ApiResponse({ status: 404, description: "Пользователь не найден" })
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
