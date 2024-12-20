import { Body, Controller, Post } from "@nestjs/common";
import { AiService } from "./ai.service";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("send-message-start")
  async sendMessageFirst(@Body("message") message: string) {
    try {
      await this.aiService.initialize();
      return await this.aiService.sendMessageFirst(message);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error; // Или вернуть конкретный ответ об ошибке
    }
  }

  @Post("send-message")
  async sendMessage(
    @Body("message") message: string,
    @Body("prompt") prompt: string
  ) {
    await this.aiService.initialize(); // Инициализация и получение токена
    return await this.aiService.sendMessage(message, prompt);
  }

  @Post("get-actions")
  async chooseAction(@Body("message") message: string) {
    await this.aiService.initialize(); // Инициализация и получение токена
    return await this.aiService.getActions(message);
  }
}
