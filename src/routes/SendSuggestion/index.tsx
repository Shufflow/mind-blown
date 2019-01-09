import { compose } from '@typed/compose';
import React from 'react';
import { TextInput } from 'react-native';

import PhrasesDataSource from 'src/models/phrases';
import withHeader from 'src/utils/hocs/withHeader';

import styles from './styles';
import withSettingsModal, {
  SettingsModalProps,
} from 'src/utils/hocs/withSettingsModal';

interface State {
  text: string;
}

class SuggestionForm extends React.Component<SettingsModalProps, State> {
  dataSource: PhrasesDataSource = new PhrasesDataSource();

  state = {
    text: '',
  };

  onChangeText = (text: string) => {
    this.setState({ text });
  };

  onPressDone = async () => {
    const { text } = this.state;
    if (text) {
      await this.dataSource.sendSuggestion(text);
    }

    this.props.dismiss();
  };

  render() {
    return (
      <TextInput
        onChangeText={this.onChangeText}
        style={styles.container}
        autoFocus
        editable
        multiline
      />
    );
  }
}

const enhance = compose(
  withSettingsModal('Send Suggestion'),
  withHeader({
    leftButton: {
      label: 'Cancel',
      onPress: ({ dismiss }: SettingsModalProps) => {
        dismiss();
      },
    },
    rightButton: {
      label: 'Done',
      onPress: (_, ref: SuggestionForm) => {
        ref.onPressDone();
      },
    },
    title: 'Send Suggestion',
  }),
);

export default enhance(SuggestionForm);
