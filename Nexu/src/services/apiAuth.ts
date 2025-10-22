import { ForgotPasswordSchemaType, LoginSchemaType, RegisterSchemaType } from 'src/schemas/authSchema'
import { api } from 'src/services/api'

const Login = async (payload: LoginSchemaType) => {
  const response = await api.post('/auth/login', payload)

  return response.data
}

const Register = async (payload: RegisterSchemaType) => {
  const response = await api.post('/auth/register', payload)

  return response.data
}

const ForgotPassword = async (payload: ForgotPasswordSchemaType) => {
  const response = await api.post('/auth/forgot-password', payload)

  return response.data
}

export { Login, Register, ForgotPassword }
