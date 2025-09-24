import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import AppTabs from "src/app/routes/AppTabs";
import LoginPage from 'src/screens/Login'
import RegisterPage from 'src/screens/Register'
import NexuPage from 'src/screens/Nexu'
import ForgotPasswordPage from 'src/screens/ForgotPassword'
import HomePage from 'src/screens/Home'

const Stack = createNativeStackNavigator()

const Routes = () => {
  return (
    // @ts-ignore
    <Stack.Navigator initialRouteName='Nexu' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Nexu' component={NexuPage} />
      <Stack.Screen name='Login' component={LoginPage} />
      <Stack.Screen name='Register' component={RegisterPage} />
      <Stack.Screen name='ForgotPassword' component={ForgotPasswordPage} />
      <Stack.Screen name='Home' component={HomePage} />
      {/* <Stack.Screen name="AppTabs" component={AppTabs} /> */}
    </Stack.Navigator>
  )
}

export default Routes
