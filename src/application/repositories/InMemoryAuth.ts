// import User from '@domain/entities/User'
// import IAuthRepository, { ICreateUserData } from '@domain/repositories/IAuthRepository'
// import { generateId } from '@utils/id'

// export default class InMemoryAuth implements IAuthRepository {
// 	data: User[] = []
// 	async createUser(user: ICreateUserData): Promise<string> {
// 		const newId = await generateId()
// 		this.data.push({ id: newId, ...user })
// 		return newId
// 	}

// 	async getUserByEmail(email: string): Promise<User | undefined> {
// 		for (const user of this.data) {
// 			if (user.email === email) {
// 				return user
// 			}
// 		}

// 		return
// 	}

// 	async verifyEmailAlreadyUsed(email: string): Promise<boolean> {
// 		for (const user of this.data) {
// 			if (user.email === email) {
// 				return true
// 			}
// 		}

// 		return false
// 	}
// }
