import { Fragment } from 'react'
import Routes from './src/app/routes/'
import { NavigationContainer } from '@react-navigation/native'
import { ToastWrapper } from './src/utils/toast'

export default function App() {
  return (
    <Fragment>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
      <ToastWrapper />
    </Fragment>
  )
}
