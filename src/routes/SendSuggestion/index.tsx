import { compose } from '@typed/compose';
import React from 'react';
import { TextInput } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import PhrasesDataSource from 'src/models/phrases';
import withHeader from 'src/utils/hocs/withHeader';

import styles from './styles';

interface State {
  text: string;
}

class SuggestionForm extends React.Component<NavigationScreenProps, State> {
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

    this.props.navigation.goBack();
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
      onPress: ({ navigation }: NavigationScreenProps) => {
        navigation.goBack();
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
