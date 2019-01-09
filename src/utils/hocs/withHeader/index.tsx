import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from './styles';

export interface HeaderProps {
  dark: string;
  light: string;
}

interface Button<T> {
  label: string;
  onPress: (props: T, ref: any) => void;
}

interface HOCProps<T> {
  leftButton?: Button<T>;
  rightButton?: Button<T>;
  title: string;
  addMargin?: boolean;
}

const withHeader = <T extends Object>({
  addMargin = true,
  leftButton,
  title,
  rightButton,
}: HOCProps<T>) => (
  WrappedComponent: React.ComponentType<T>,
): React.ComponentType<T & HeaderProps> => {
  class ComponentWithHeader extends React.PureComponent<T & HeaderProps> {
    wrappedRef?: any;

    onPressButton = (button: Button<T>) => () => {
      button.onPress(this.props, this.wrappedRef);
    };

    handleWrappedRef = (ref: any) => {
      this.wrappedRef = ref;
    };

    render() {
      const { dark, light } = this.props;
      return (
        <React.Fragment>
          <StatusBar barStyle='light-content' />
          <SafeAreaView style={styles.background(dark)} />
          <SafeAreaView style={styles.container(light)}>
            <View
              style={[styles.header(dark), addMargin && styles.headerMargin]}
            >
              {!!leftButton && (
                <TouchableOpacity onPress={this.onPressButton(leftButton)}>
                  <Text style={styles.doneButton(light)}>
                    {leftButton.label}
                  </Text>
                </TouchableOpacity>
              )}
              <Text style={styles.title(light)}>{title}</Text>
              {!!rightButton && (
                <TouchableOpacity onPress={this.onPressButton(rightButton)}>
                  <Text style={styles.doneButton(light)}>
                    {rightButton.label}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <WrappedComponent ref={this.handleWrappedRef} {...this.props} />
          </SafeAreaView>
        </React.Fragment>
      );
    }
  }

  return ComponentWithHeader;
};

export default withHeader;
