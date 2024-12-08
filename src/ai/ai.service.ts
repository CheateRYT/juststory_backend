import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GigaChat } from 'gigachat-node'
@Injectable()
export class AiService {
	private client: GigaChat

	constructor() {
		this.client = new GigaChat(process.env['AI_TOKEN'], true, true, true)
	}

	async initialize() {
		await this.client.createToken()
	}

	async sendMessageFirst(message: string) {
		try {
			const response = await this.client.completion({
				model: 'GigaChat:latest',
				messages: [
					{
						role: 'user',
						content: `Сгенерируй историю кратко минимум 300 символов максимум 500 сама история - ${message} я сам буду делать продолжение истории. Мое приложение это игра story teller где человек  играет и ему дается закончить эту историю  и генерируется потом продолжение истории в зависимости что он выбрал. Не завершай историю а дай мне ее продолжать. Отправь только текст истории которую я засуну в игру`,
					},
				],
			})

			const aiResponse = response.choices[0].message.content

			const responseObject = {
				message: aiResponse,
			}
			return responseObject // Возвращаем объект с историей и вариантами
		} catch (error) {
			throw new HttpException(
				`Ошибка при отправке сообщения - ${error.message}`,
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
	}
	async sendMessage(message: string, prompt: string) {
		try {
			const response = await this.client.completion({
				model: 'GigaChat:latest',
				messages: [
					{
						role: 'user',
						content:
							message +
							`Я хочу сделать это в истории - ${prompt}; вот это и скинь только текст продолжения истории сразу без своих выражений`,
					},
				],
			})

			const aiResponse = response.choices[0].message.content

			const responseObject = {
				initial: aiResponse,
			}

			return responseObject // Возвращаем объект с историей и вариантами
		} catch (error) {
			throw new HttpException(
				`Ошибка при отправке сообщения - ${error.message}`,
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
	}
	async getActions(message: string) {
		try {
			const response = await this.client.completion({
				model: 'GigaChat:latest',
				messages: [
					{
						role: 'user',
						content:
							message +
							'Скинь текст 4 варианта действия в формате [Действие1!Действие2!Действие3!Действие4] отправь действие в формате в квадратных скобках через восклицательный знак, заново текст истории не отправляй, отправь только варианты ответа',
					},
				],
			})

			const aiResponse = response.choices[0].message.content

			const responseObject = {
				initial: aiResponse,
			}

			return responseObject // Возвращаем объект с историей и вариантами
		} catch (error) {
			throw new HttpException(
				`Ошибка при отправке сообщения - ${error.message}`,
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
	}
	// async generateImage(prompt: string) {
	// 	try {
	// 		const response = await this.client.completion({
	// 			model: 'GigaChat:latest',
	// 			messages: [
	// 				{
	// 					role: 'user',
	// 					content: `Нарисуй фото ${prompt}`,
	// 				},
	// 			],
	// 		})

	// 		// Логируем весь ответ для отладки
	// 		console.log('Ответ от API:', response)

	// 		const imageUrl = response.choices[0]?.message?.image // Используем опциональную цепочку
	// 		if (!imageUrl) {
	// 			throw new Error(
	// 				'Изображение не было сгенерировано или отсутствует в ответе.'
	// 			)
	// 		}

	// 		// Сохранение изображения
	// 		const imagePath = path.join(
	// 			__dirname,
	// 			'..',
	// 			'..',
	// 			'public',
	// 			'img',
	// 			`${Date.now()}.png`
	// 		)
	// 		const imageBuffer = Buffer.from(imageUrl, 'base64') // Предполагается, что изображение приходит в формате base64
	// 		fs.writeFileSync(imagePath, imageBuffer)
	// 		return { imagePath: `/img/${path.basename(imagePath)}` } // Возвращаем путь к изображению
	// 	} catch (error) {
	// 		console.error('Ошибка при генерации изображения:', error) // Логируем ошибку
	// 		throw new HttpException(
	// 			`Ошибка при генерации изображения - ${error.message}`,
	// 			HttpStatus.INTERNAL_SERVER_ERROR
	// 		)
	// 	}
	// }
}
