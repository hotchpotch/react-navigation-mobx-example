// @flow

import { BackAndroid, Platform } from 'react-native';
import React, { Component } from 'react';

interface BackButtonPressed {
  backButtonPressed(): boolean,
}

type BackButtonPressedComponent = Class<BackButtonPressed> & ReactClass<any>;

export default function handleBackButton(
  WrappedComponent: BackButtonPressedComponent,
): ReactClass<any> {
  class BackButtonComponent extends Component {
    componentDidMount() {
      const { backButtonPressed } = this.targetComponentRef;
      this.backButtonPressedSubscription = BackAndroid.addEventListener(
        'backPress',
        backButtonPressed,
      );
    }

    componentWillUnmount() {
      if (this.backButtonPressedSubscription) {
        this.backButtonPressedSubscription.remove();
      }
    }

    targetComponentRef: typeof WrappedComponent;

    backButtonPressedSubscription: ?{
      remove(): void,
    };

    render() {
      return (
        <WrappedComponent
          ref={(component: typeof WrappedComponent) => {
            this.targetComponentRef = component;
          }}
          {...this.props}
        />
      );
    }
  }

  return Platform.select({
    ios: WrappedComponent,
    android: BackButtonComponent,
  });
}
