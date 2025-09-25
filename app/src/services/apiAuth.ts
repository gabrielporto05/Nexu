import { LoginSchemaType, RegisterSchemaType } from 'src/schemas/authSchema'
import { api } from 'src/services/api'
import { setToken } from 'src/utils/token'

const fetchUserProfile = async (token: string) => {
  const response = await api.get('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

const Login = async (payload: LoginSchemaType) => {
  const response = await api.post('/auth/login', payload)

  await setToken(response.data.data)

  return response.data
}

const Register = async (payload: RegisterSchemaType) => {
  const response = await api.post('/auth/register', payload)

  return response.data
}

export { fetchUserProfile, Login, Register }
