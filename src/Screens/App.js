import React, { Component } from "react"
import RootStack from "../Navigation/AppNavigation"
import moment from "moment"

class App extends Component {
  render() {
    // Updates moment relative time, not sure where to call this
    // https://momentjs.com/docs/#/customization/relative-time/
    moment.updateLocale("en", {
      relativeTime: {
        ss: "%ds",
        s: "%ds",
        m: "%dm",
        mm: "%dm",
        h: "%dh",
        hh: "%dh",
        d: "%dd",
        dd: "%dd"
      }
    })

    return <RootStack />
  }
}

export default App
