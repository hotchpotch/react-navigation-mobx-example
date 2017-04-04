// @flow
import {
  NavigationActions,
} from 'react-navigation';

import type {
  NavigationAction,
  NavigationNavigator,
  NavigationState,
  NavigationRouter,
  NavigationRoute,
  NavigationParams,
} from 'react-navigation';

import { action, computed, observable } from 'mobx';
import autobind from 'autobind-decorator';

function getCurrentState(
  state: NavigationState,
): NavigationState | (NavigationRoute & NavigationState) {
  const childRoute = state.routes[state.index];
  if (childRoute.routes) {
    return getCurrentState(childRoute);
  }
  return childRoute;
}

class NavigationStore {
  @observable.ref
  navigationState: ?NavigationState = null;
  navigator: ?NavigationNavigator<*> = null;

  @action setNavigator(navigator: NavigationNavigator<*>) {
    this.navigator = navigator;
    this.navigationState = navigator.router.getStateForAction(NavigationActions.init({}));
  }

  get router(): ?NavigationRouter {
    if (this.navigator) {
      return this.navigator.router;
    }
    return null;
  }

  @action.bound
  dispatchNavigation(routerAction: NavigationAction, stackState: boolean = true): boolean {
    const previousNavState: ?NavigationState = stackState ? this.navigationState : null;
    if (this.router) {
      const newState = this.router.getStateForAction(routerAction, previousNavState);
      if (newState && newState !== previousNavState) {
        this.navigationState = newState;
        return true;
      }
    }
    return false;
  }

  @computed get state(): NavigationState | (NavigationRoute & NavigationState) {
    return getCurrentState(this.navigationState);
  }

  @autobind goBack(key?: ?string): boolean {
    const navKey: ?string = this.navigationState ? this.navigationState.key : key;
    return this.dispatchNavigation(
      NavigationActions.back({
        key: key === undefined ? navKey : key,
      }),
    );
  }

  @autobind navigate(
    routeName: string,
    params?: NavigationParams,
    navAction?: NavigationAction,
  ): boolean {
    return this.dispatchNavigation(
      NavigationActions.navigate({
        routeName,
        params,
        action: navAction,
      }),
    );
  }

  @autobind setParams(params: NavigationParams): boolean {
    return this.dispatchNavigation(
      NavigationActions.setParams({
        params,
        key: this.state.key,
      }),
    );
  }
}

export default NavigationStore;
