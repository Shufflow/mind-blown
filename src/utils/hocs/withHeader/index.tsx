import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

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
      const { bgColor, fgColor } = this.props;
      return (
        <React.Fragment>
          <SafeAreaView style={styles.background(bgColor)} />
          <SafeAreaView style={styles.container(fgColor)}>
            <View style={styles.header(bgColor)}>
              {!!leftButton && (
                <TouchableOpacity onPress={this.onPressButton(leftButton)}>
                  <Text style={styles.doneButton(fgColor)}>
                    {leftButton.label}
                  </Text>
                </TouchableOpacity>
              )}
              <Text style={styles.title(fgColor)}>{title}</Text>
              {!!rightButton && (
                <TouchableOpacity onPress={this.onPressButton(rightButton)}>
                  <Text style={styles.doneButton(fgColor)}>
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
