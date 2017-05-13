// @flow
import { addNavigationHelpers } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import autobind from 'autobind-decorator';

import NavigationStore from '../stores/NavigationStore';
import handleBackButton from './handleBackButton';


export default function createNavigationContainer(Component: ReactClass<*>): ReactClass<*> {
  @inject('nav')
  @handleBackButton
  @observer
  class NavigationContainer extends React.Component {
    static defaultProps = {
      nav: null,
    };
    props: {
      nav: NavigationStore,
    };
    @autobind backButtonPressed():boolean {
      const { nav } = this.props;
      const result: boolean = !!nav.goBack();
      if (nav.state.routeName === 'AppDispatcher') {
        // goBack で AppDispatcher に戻ってきたらアプリを終える
        return !!nav.goBack();
      }
      return result;
    }

    render() {
      const { nav } = this.props;
      const navigationHelper = addNavigationHelpers({
        dispatch: nav.dispatchNavigation,
        state: nav.navigationState,
      });
      return <Component navigation={navigationHelper} />;
    }
  }
  return NavigationContainer;
}
