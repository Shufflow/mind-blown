import React from 'react';
import { Modal } from 'react-native';

import { BasicColors } from 'src/utils/hocs/withColors';

import ListItem from 'src/components/ListItem';

import SuggestionForm from './SuggestionForm';

interface State {
  isModalVisible: boolean;
}

class SendSuggestion extends React.Component<BasicColors, State> {
  state = {
    isModalVisible: false,
  };

  toggleModalVisible = (isModalVisible: boolean) => () => {
    this.setState({ isModalVisible });
  };

  render() {
    const { bgColor, fgColor } = this.props;
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
            bgColor={bgColor}
            fgColor={fgColor}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

export default SendSuggestion;
