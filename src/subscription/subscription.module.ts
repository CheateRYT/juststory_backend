import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'

@Module({
	controllers: [SubscriptionController],
	providers: [SubscriptionService, PrismaService, UserService],
})
export class SubscriptionModule {}
