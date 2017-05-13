// @flow

import {
  NavigationAction,
  NavigationActions,
  NavigationNavigator,
  NavigationParams,
  NavigationRoute,
  NavigationRouter,
  NavigationState,
} from 'react-navigation';
import { action, computed, observable } from 'mobx';
import autobind from 'autobind-decorator';

export type HasRouter = {
  router: NavigationRouter,
};

type NavOrHasRouter = NavigationNavigator<*> | HasRouter;

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
  @observable.ref navigationState: ?NavigationState = null;
  navigator: ?NavOrHasRouter = null;

  @action setNavigator(navigator: NavOrHasRouter) {
    this.navigator = navigator;
    this.navigationState = navigator.router.getStateForAction(NavigationActions.init({}));
  }

  @computed get router(): ?NavigationRouter {
    if (this.navigator) {
      return this.navigator.router;
    }
    return null;
  }

  @computed get params(): { [string]: string } {
    return this.state.params || {};
  }

  @action.bound dispatchNavigation(
    routerAction: NavigationAction,
    reset: boolean = false,
  ): ?NavigationState {
    const previousNavState: ?NavigationState = reset ? null : this.navigationState;
    if (this.router) {
      const newState = this.router.getStateForAction(routerAction, previousNavState);
      if (newState && newState !== previousNavState) {
        this.navigationState = newState;
        return newState;
      }
    }
    return null;
  }

  @computed get state(): NavigationState | (NavigationRoute & NavigationState) {
    return getCurrentState(this.navigationState);
  }

  @autobind goBack(key?: ?string): ?NavigationState {
    const navKey: ?string = this.navigationState ? this.navigationState.key : key;
    return this.dispatchNavigation(
      NavigationActions.back({
        key: key === undefined ? navKey : key,
      }),
    );
  }

  @autobind reset(
    routeName: string,
    params?: NavigationParams,
    navAction?: NavigationAction,
  ): ?NavigationState {
    const resetAction: NavigationAction = NavigationActions.navigate({
      routeName,
      params,
      actions: navAction,
    });

    return this.dispatchNavigation(
      {
        type: NavigationActions.RESET,
        actions: [resetAction],
        index: 0,
      },
      true,
    );
  }

  @autobind navigate(
    routeName: string,
    params?: NavigationParams,
    navAction?: NavigationAction,
  ): ?NavigationState {
    return this.dispatchNavigation(
      NavigationActions.navigate({
        routeName,
        params,
        action: navAction,
      }),
    );
  }

  @autobind setParams(params: NavigationParams): ?NavigationState {
    return this.dispatchNavigation(
      NavigationActions.setParams({
        params,
        key: this.state.key,
      }),
    );
  }
}

export default NavigationStore;
