import { Injectable, OnModuleInit } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SubscriptionCheckerService implements OnModuleInit {
	constructor(private readonly prisma: PrismaService) {}

	onModuleInit() {
		// Запускаем проверку подписок при старте приложения
		this.checkExpiredSubscriptions()
	}

	@Cron('0 * * * *') // Запускаем каждую минуту
	async checkExpiredSubscriptions() {
		const now = new Date()

		const expiredUsers = await this.prisma.user.findMany({
			where: {
				subscription: true,
				subEndTime: {
					lt: now,
				},
			},
		})

		for (const user of expiredUsers) {
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					subscription: false,
					subBuyTime: null,
					subEndTime: null,
				},
			})
			console.log(
				`Подписка пользователя ${user.name} истекла и была отключена.`
			)
		}
	}
}
