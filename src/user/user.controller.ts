import { Body, Controller, Get, Post, Request } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(private readonly usersService: UserService) {}

	@Post('register')
	async register(
		@Body('login') login: string,
		@Body('password') password: string
	) {
		return this.usersService.register(login, password)
	}

	@Post('login')
	async login(
		@Body('login') login: string,
		@Body('password') password: string
	) {
		const user = await this.usersService.validateUser(login, password)
		if (!user) {
			throw new Error('Неверный логин или пароль')
		}
		const token = await this.usersService.generateToken(user)
		return { message: 'Успешный вход', user, token }
	}
	@Get('validate-token')
	async validateToken(@Request() req) {
		const token = req.headers.authorization?.split(' ')[1] //
		if (!token) {
			return { valid: false }
		}
		const user = await this.usersService.validateToken(token)
		return { valid: !!user }
	}
	@Get('get-subcription-info')
	async getSubscriptionDetails(@Request() req) {
		const token = req.headers.authorization?.split(' ')[1] //
		if (!token) {
			return { valid: false, message: 'Токен не предоставлен' }
		}
		const subscriptionDetails =
			await this.usersService.getUserSubscriptionDetails(token)
		return { subscriptionDetails }
	}
}
