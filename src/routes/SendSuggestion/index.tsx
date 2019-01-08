import React from 'react';
import { Modal } from 'react-native';

import { HeaderProps } from 'src/utils/hocs/withHeader';

import ListItem from 'src/components/ListItem';

import SuggestionForm from './SuggestionForm';

interface State {
  isModalVisible: boolean;
}

class SendSuggestion extends React.Component<HeaderProps, State> {
  state = {
    isModalVisible: false,
  };

  toggleModalVisible = (isModalVisible: boolean) => () => {
    this.setState({ isModalVisible });
  };

  render() {
    const { dark, light } = this.props;
    const { isModalVisible } = this.state;
    return (
      <React.Fragment>
        <ListItem
          label='Send Suggestion'
          onPress={this.toggleModalVisible(true)}
        />
        <Modal animationType='slide' transparent visible={isModalVisible}>
          <SuggestionForm
            dismiss={this.toggleModalVisible(false)}
            dark={dark}
            light={light}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

export default SendSuggestion;
