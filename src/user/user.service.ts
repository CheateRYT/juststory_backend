import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import * as argon2 from 'argon2'
import * as jwt from 'jsonwebtoken'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async register(login: string, password: string): Promise<User> {
		const hashedPassword = await argon2.hash(password)
		const newUser = await this.prisma.user.create({
			data: {
				name: login,
				password: hashedPassword,
				token: '',
				subscription: false,
				subBuyTime: null,
				subEndTime: null,
			},
		})
		return newUser
	}

	async findUserByLogin(login: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { name: login } })
	}

	async validateUser(login: string, password: string): Promise<User | null> {
		const user = await this.findUserByLogin(login)
		if (user && (await argon2.verify(user.password, password))) {
			return user
		}
		return null
	}

	async generateToken(user: User): Promise<string> {
		const payload = { id: user.id, name: user.name }
		return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
	}

	async validateToken(token: string): Promise<User | null> {
		try {
			const decoded: any = jwt.verify(token, process.env.JWT_SECRET)
			return this.prisma.user.findUnique({ where: { id: decoded.id } })
		} catch (error) {
			return null
		}
	}

	async getUserSubscriptionDetails(token: string): Promise<{
		subscription: boolean
		subBuyTime: Date | null
		subEndTime: Date | null
	} | null> {
		const user = await this.validateToken(token)
		if (!user) {
			return null
		}
		return {
			subscription: user.subscription,
			subBuyTime: user.subBuyTime,
			subEndTime: user.subEndTime,
		}
	}
}
