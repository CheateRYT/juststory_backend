import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule' // Импортируем ScheduleModule
import { PrismaService } from 'src/prisma/prisma.service'
import { SubscriptionController } from 'src/subscription/subscription.controller'
import { SubscriptionService } from 'src/subscription/subscription.service'
import { UserService } from 'src/user/user.service'
import { SubscriptionCheckerService } from './subscription-checker.service' // Импортируем новый сервис

@Module({
	imports: [ScheduleModule.forRoot()], // Добавляем ScheduleModule
	controllers: [SubscriptionController],
	providers: [
		SubscriptionService,
		PrismaService,
		UserService,
		SubscriptionCheckerService,
	],
})
export class SubscriptionCheckerModule {}
