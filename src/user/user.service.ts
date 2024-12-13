import { Injectable, Inject } from "@nestjs/common";
import { User } from "@prisma/client";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { PrismaService } from "src/prisma/prisma.service";
import Redis from "ioredis";
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject("REDIS_CLIENT") private readonly redis: Redis
  ) {}

  async onModuleInit() {
    await this.createDefaultAdminFirst();
    await this.createDefaultAdminSecond();
  }

  async createDefaultAdminFirst() {
    const existingAdminFirst = await this.prisma.user.findFirst({
      where: { name: "adminlev" },
    });

    if (!existingAdminFirst) {
      const hashedPassword = await argon2.hash("qwerty");
      await this.prisma.user.create({
        data: {
          name: "adminlev",
          password: hashedPassword,
          token: "",
          subscription: false,
          subBuyTime: null,
          subEndTime: null,
          role: "Admin",
        },
      });
    }
  }
  async createDefaultAdminSecond() {
    const existingAdminSecond = await this.prisma.user.findFirst({
      where: { name: "adminzhenya" },
    });
    const subBuyTime = new Date("2024-11-28T00:00:00.000Z");
    const subEndTime = new Date(subBuyTime);
    subEndTime.setDate(subEndTime.getDate() + 30);

    if (!existingAdminSecond) {
      const hashedPassword = await argon2.hash("qwerty2");
      await this.prisma.user.create({
        data: {
          name: "adminzhenya",
          password: hashedPassword,
          token: "",
          subscription: true,
          subBuyTime: subBuyTime,
          subEndTime: subEndTime,
          role: "Admin",
        },
      });
    }
  }

  async register(login: string, password: string): Promise<User> {
    const hashedPassword = await argon2.hash(password);
    const newUser = await this.prisma.user.create({
      data: {
        name: login,
        password: hashedPassword,
        token: "",
        subscription: false,
        subBuyTime: null,
        subEndTime: null,
      },
    });
    return newUser;
  }
  async findUserByLogin(login: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { name: login } });
  }

  async validateUser(login: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { name: login } });
    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  async generateToken(user: User): Promise<string> {
    const payload = { id: user.id, name: user.name };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      return this.prisma.user.findUnique({ where: { id: decoded.id } });
    } catch (error) {
      return null;
    }
  }

  async getUserRoleByToken(token: string): Promise<string | null> {
    const user = await this.validateToken(token);
    return user ? user.role : null;
  }

  async getUser(token: string): Promise<any> {
    const cachedUser = await this.redis.get(`user:${token}`);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.validateToken(token);
    if (!user) {
      return null;
    }

    const userDetails = {
      name: user.name,
      role: user.role,
      subscription: user.subscription,
      subBuyTime: user.subBuyTime,
      subEndTime: user.subEndTime,
    };

    // Кэшируем данные на 1 час
    await this.redis.set(
      `user:${token}`,
      JSON.stringify(userDetails),
      "EX",
      3600
    );

    return userDetails;
  }
}
