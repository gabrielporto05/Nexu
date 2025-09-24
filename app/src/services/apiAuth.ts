import { LoginSchemaType, RegisterSchemaType } from 'src/schemas/authSchema'
import { api } from 'src/services/api'
import { setToken } from 'src/utils/token'

const Login = async (payload: LoginSchemaType) => {
  const response = await api.post('/auth/login', payload)

  await setToken(response.data.token)

  return response.data
}

const Register = async (payload: RegisterSchemaType) => {
  const response = await api.post('/auth/register', payload)

  return response.data
}

export { Login, Register }
