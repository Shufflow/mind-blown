import React from 'react';
import { Modal } from 'react-native';

import { HeaderProps } from 'src/utils/hocs/withHeader';

import ListItem from 'src/components/ListItem';

export interface SettingsModalProps extends HeaderProps {
  dismiss: () => void;
}

interface State {
  isModalVisible: boolean;
}

const withSettingsModal = (label: string) => (
  WrappedComponent: React.ComponentType<SettingsModalProps>,
): React.ComponentClass<HeaderProps, State> => {
  class SettingsModalHOC extends React.Component<HeaderProps, State> {
    state = { isModalVisible: false };

    toggleModalVisible = (isModalVisible: boolean) => () => {
      this.setState({ isModalVisible });
    };

    render() {
      const { dark, light } = this.props;
      const { isModalVisible } = this.state;
      return (
        <React.Fragment>
          <ListItem label={label} onPress={this.toggleModalVisible(true)} />
          <Modal animationType='slide' transparent visible={isModalVisible}>
            <WrappedComponent
              dark={dark}
              dismiss={this.toggleModalVisible(false)}
              light={light}
            />
          </Modal>
        </React.Fragment>
      );
    }
  }

  return SettingsModalHOC;
};

export default withSettingsModal;
