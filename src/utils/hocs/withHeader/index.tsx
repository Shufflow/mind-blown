import React from 'react';
import { StatusBar, Text, View, SafeAreaView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import Button, { ButtonTheme } from '@components/Button';

import styles from './styles';

export interface HeaderProps {
  dark: string;
  light: string;
}

interface ButtonType<T> {
  label: string;
  onPress: (props: T, ref: any) => void;
}

interface HOCProps<T> {
  leftButton?: ButtonType<T>;
  rightButton?: ButtonType<T>;
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
): React.ComponentType<T & NavigationScreenProps> => {
  class ComponentWithHeader extends React.PureComponent<
    T & NavigationScreenProps
  > {
    wrappedRef?: any;

    onPressButton = (button: ButtonType<T>) => () => {
      button.onPress(this.props, this.wrappedRef);
    };

    handleWrappedRef = (ref: any) => {
      this.wrappedRef = ref;
    };

    getParam = (name: string): string => {
      const prop = (this.props as { [key: string]: any })[name];
      return this.props.navigation.getParam(name, prop);
    };

    render() {
      const dark = this.getParam('dark');
      const light = this.getParam('light');
      return (
        <React.Fragment>
          <StatusBar barStyle='light-content' />
          <SafeAreaView style={styles.background(dark)} />
          <SafeAreaView style={styles.container(light)}>
            <View
              style={[styles.header(dark), addMargin && styles.headerMargin]}
            >
              {!!leftButton && (
                <Button
                  onPress={this.onPressButton(leftButton)}
                  textStyle={styles.doneButton(light)}
                  theme={ButtonTheme.minimalist}
                >
                  {leftButton.label}
                </Button>
              )}
              <Text style={styles.title(light)}>{title}</Text>
              {!!rightButton && (
                <Button
                  onPress={this.onPressButton(rightButton)}
                  textStyle={styles.doneButton(light)}
                  theme={ButtonTheme.minimalist}
                >
                  {rightButton.label}
                </Button>
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
