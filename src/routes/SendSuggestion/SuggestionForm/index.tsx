import { compose } from '@typed/compose';
import React from 'react';
import { TextInput } from 'react-native';

import PhrasesDataSource from 'src/models/phrases';
import { ColorProps } from 'src/utils/hocs/withColors';
import withHeader from 'src/utils/hocs/withHeader';

import styles from './styles';

interface Props extends ColorProps {
  dismiss: () => void;
}

interface State {
  text: string;
}

class SuggestionForm extends React.Component<Props, State> {
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
  withHeader({
    leftButton: {
      label: 'Cancel',
      onPress: ({ dismiss }: Props) => {
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
