import React, { Component } from 'react'
import RootStack from '../Navigation/AppNavigation'
import moment from 'moment'

import { YellowBox } from 'react-native'

class App extends Component {
  render() {
    this.configYellowBox()

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

    return <RootStack />
  }

  configYellowBox = () => {
    const isMounted = 'Warning: isMounted'
    const debuggerError = 'Remote debugger is in a background tab which may'
    // TODO definitely fix this oen
    const navigation = 'You should only render'

    YellowBox.ignoreWarnings([
      isMounted,
      'Unable to symbolicate',
      debuggerError,
      navigation,
      'Warning: isMounted(...) is deprecated',
      'Module RCTImageLoader',
      'Warning: In next release empty'
    ])

    console.ignoredYellowBox = [
      isMounted,
      'Unable to symbolicate',
      debuggerError,
      navigation,
      'Warning: isMounted(...) is deprecated',
      'Module RCTImageLoader',
      'Module RCTImageLoader requires main queue setup since it overrides',
      'Warning: In next release empty'
    ]
  }
}

export default App
