import { NavigationActions } from 'react-navigation'

let _container // eslint-disable-line

function setContainer(container) {
  _container = container
}

function reset(routeName, params) {
  _container.dispatch(
    NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          type: 'Navigation/NAVIGATE',
          routeName,
          params
        })
      ]
    })
  )
}

function navigate(routeName, params) {
  _container.dispatch(
    NavigationActions.navigate({
      type: 'Navigation/NAVIGATE',
      routeName,
      params
    })
  )
}

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

function getCurrentRoute() {
  if (!_container) return null
  return getActiveRouteName( _container.state.nav)
}

export default {
  setContainer,
  navigate,
  reset,
  getCurrentRoute,
}
