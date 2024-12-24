import { Body, Controller, Post } from "@nestjs/common";
import { AiService } from "./ai.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("AI")
@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("send-message-start")
  @ApiOperation({ summary: "Инициализирует и отправляет первое сообщение" })
  @ApiResponse({ status: 200, description: "Сообщение успешно отправлено" })
  @ApiResponse({ status: 500, description: "Ошибка при отправке сообщения" })
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
  @ApiOperation({ summary: "Отправляет сообщение с заданным промптом" })
  @ApiResponse({ status: 200, description: "Сообщение успешно отправлено" })
  @ApiResponse({ status: 500, description: "Ошибка при отправке сообщения" })
  async sendMessage(
    @Body("message") message: string,
    @Body("prompt") prompt: string
  ) {
    await this.aiService.initialize();
    return await this.aiService.sendMessage(message, prompt);
  }

  @Post("get-actions")
  @ApiOperation({ summary: "Получает доступные действия на основе сообщения" })
  @ApiResponse({ status: 200, description: "Действия успешно получены" })
  @ApiResponse({ status: 500, description: "Ошибка при получении действий" })
  async chooseAction(@Body("message") message: string) {
    await this.aiService.initialize();
    return await this.aiService.getActions(message);
  }
}
