export interface IRegisterInput {
	username: string
	email: string
	password: string
}

export interface ILoginInput {
	email: string
	password: string
}

export interface IUserOutput {
	id: string
	email: string
	username: string
}
