import { Body, Controller, Get, Patch, Post, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "@prisma/client";

@Controller("user")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post("register")
  async register(
    @Body("login") login: string,
    @Body("password") password: string
  ) {
    return this.usersService.register(login, password);
  }

  @Post("login")
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
  async validateToken(@Request() req) {
    const token = req.headers.authorization?.split(" ")[1]; //
    if (!token) {
      return { valid: false };
    }
    const user = await this.usersService.validateToken(token);
    return { valid: !!user };
  }
  @Get("/")
  async getUser(@Request() req) {
    const token = req.headers.authorization?.split(" ")[1]; //
    if (!token) {
      return { valid: false, message: "Токен не предоставлен" };
    }
    const userDetails = await this.usersService.getUser(token);
    return { userDetails };
  }

  @Patch("update")
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
