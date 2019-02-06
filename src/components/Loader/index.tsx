import React from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';

import styles, { LoaderColor } from './styles';

const Constants = {
  animationDuration: 280,
};

let Loader: LoaderComponent | undefined;

interface State {
  isVisible: boolean;
}

export class LoaderComponent extends React.Component<{}, State> {
  fadeAnimation = new Animated.Value(0);
  state = {
    isVisible: false,
  };

  constructor(props: {}) {
    super(props);

    if (Loader) {
      // tslint:disable-next-line: no-console
      console.warn('A Loader is already in use');
    } else {
      Loader = this;
    }
  }

  show = () => {
    Animated.timing(this.fadeAnimation, {
      duration: Constants.animationDuration,
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ isVisible: true });
    });
  };

  hide = () => {
    Animated.timing(this.fadeAnimation, {
      duration: Constants.animationDuration,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ isVisible: false });
    });
  };

  render() {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: this.fadeAnimation,
          },
        ]}
        pointerEvents={this.state.isVisible ? 'auto' : 'none'}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={LoaderColor} size='large' />
        </View>
      </Animated.View>
    );
  }
}

export default {
  hide: () => {
    Loader!.hide();
  },
  show: () => {
    Loader!.show();
  },
};
