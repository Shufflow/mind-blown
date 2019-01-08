import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ColorProps } from '../withColors';

import styles from './styles';

interface Button<T> {
  label: string;
  onPress: (props: T, ref: any) => void;
}

interface HOCProps<T> {
  leftButton?: Button<T>;
  rightButton?: Button<T>;
  title: string;
}

const withHeader = <T extends ColorProps>({
  leftButton,
  title,
  rightButton,
}: HOCProps<T>) => (
  WrappedComponent: React.ComponentType<T>,
): React.ComponentClass<T> => {
  class ComponentWithHeader extends React.PureComponent<T> {
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
            <View style={styles.header(dark)}>
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
