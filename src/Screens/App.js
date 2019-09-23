import React from 'react'
import RootStack from '../Navigation/AppNavigation'
import moment from 'moment'
import useGlobalUser from 'hooks/use-global-user'
import NavigatorService from '../services/navigator'

export default () => {
  const { authUser, initialising, user, loading } = useGlobalUser()

  if (user) {
    NavigatorService.navigate('Testing')
  } else if (!authUser && !initialising && !loading) {
    NavigatorService.navigate('SignUp')
  }

  // Updates moment relative time, not sure where to call this
  // https://momentjs.com/docs/#/customization/relative-time/
  moment.updateLocale('en', {
    relativeTime: {
      ss: '%ds',
      s: '%ds',
      m: '%dm',
      mm: '%dm',
      h: '%dh',
      hh: '%dh',
      d: '%dd',
      dd: '%dd'
    }
  })

  return (
    <RootStack
      ref={navigatorRef => {
        NavigatorService.setContainer(navigatorRef)
      }}
    />
  )
}
