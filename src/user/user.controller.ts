import { Body, Controller, Get, Patch, Post, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "@prisma/client";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post("register")
  @ApiOperation({ summary: "Регистрация нового пользователя" })
  @ApiResponse({
    status: 201,
    description: "Пользователь успешно зарегистрирован",
  })
  @ApiResponse({ status: 400, description: "Ошибка регистрации" })
  async register(
    @Body("login") login: string,
    @Body("password") password: string
  ) {
    return this.usersService.register(login, password);
  }

  @Post("login")
  @ApiOperation({ summary: "Вход пользователя" })
  @ApiResponse({ status: 200, description: "Успешный вход" })
  @ApiResponse({ status: 401, description: "Неверный логин или пароль" })
  async login(
    @Body("login") login: string,
    @Body("password") password: string
  ) {
    const user = await this.usersService.validateUser(login, password);
    if (!user) {
      throw new Error("Неверный логин или пароль");
    }
    const token = await this.usersService.generateToken(user);
    return { message: "Успешный вход", user, token };
  }

  @Get("validate-token")
  @ApiOperation({ summary: "Проверка валидности токена" })
  @ApiResponse({ status: 200, description: "Токен валиден" })
  @ApiResponse({
    status: 401,
    description: "Токен не предоставлен или не валиден",
  })
  async validateToken(@Request() req) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return { valid: false };
    }
    const user = await this.usersService.validateToken(token);
    return { valid: !!user };
  }

  @Get("/")
  @ApiOperation({ summary: "Получение информации о пользователе" })
  @ApiResponse({
    status: 200,
    description: "Информация о пользователе успешно получена",
  })
  @ApiResponse({ status: 401, description: "Токен не предоставлен" })
  async getUser(@Request() req) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return { valid: false, message: "Токен не предоставлен" };
    }
    const userDetails = await this.usersService.getUser(token);
    return { userDetails };
  }

  @Patch("update")
  @ApiOperation({ summary: "Обновление информации о пользователе" })
  @ApiResponse({
    status: 200,
    description: "Информация о пользователе обновлена",
  })
  @ApiResponse({ status: 401, description: "Токен не предоставлен" })
  async updateUser(@Request() req, @Body() updateData: Partial<User>) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Токен не предоставлен");
    }
    const user = await this.usersService.validateToken(token);
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    const updatedUser = await this.usersService.updateUser(user.id, updateData);
    return { message: "Информация о пользователе обновлена", updatedUser };
  }
}
