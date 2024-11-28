import { Injectable, OnModuleInit } from '@nestjs/common'
import { Subscription } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class SubscriptionService implements OnModuleInit {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService
	) {}

	async onModuleInit() {
		await this.createDefaultSubscription()
	}

	async createDefaultSubscription() {
		const existingSubscription = await this.prisma.subscription.findFirst({
			where: { name: 'Начитанный' },
		})

		if (!existingSubscription) {
			await this.prisma.subscription.create({
				data: {
					name: 'Начитанный',
					description: 'Полное отсутствие рекламы. + 10 к карме',
					price: '300',
					daysPeriod: 30,
				},
			})
			console.log('Default subscription created.')
		}
	}

	async getSubscriptionById(id: number) {
		return this.prisma.subscription.findUnique({ where: { id } })
	}

	async updateSubscription(
		id: number,
		data: Partial<Subscription>,
		token: string
	) {
		const userRole = await this.userService.getUserRoleByToken(token)
		if (userRole !== 'Admin') {
			throw new Error('Доступ запрещен') // Проверка роли
		}
		return this.prisma.subscription.update({
			where: { id },
			data,
		})
	}

	async purchaseSubscription(token: string, subscriptionId: number) {
		const user = await this.userService.validateToken(token)
		if (!user) {
			throw new Error('Пользователь не найден или токен недействителен')
		}

		const subscription = await this.prisma.subscription.findUnique({
			where: { id: subscriptionId },
		})
		if (!subscription) {
			throw new Error('Подписка не найдена')
		}

		const now = new Date()
		const endTime = new Date(now)
		endTime.setDate(now.getDate() + subscription.daysPeriod)

		return this.prisma.user.update({
			where: { id: user.id },
			data: {
				subscription: true,
				subBuyTime: now,
				subEndTime: endTime,
			},
		})
	}
}
