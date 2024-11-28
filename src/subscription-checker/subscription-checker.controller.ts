import { Controller } from '@nestjs/common'
import { SubscriptionCheckerService } from './subscription-checker.service'

@Controller('subscription-checker')
export class SubscriptionCheckerController {
	constructor(
		private readonly subscriptionCheckerService: SubscriptionCheckerService
	) {}
}
