import React from 'react';
import { TextInput } from 'react-native';

import { ColoredScreenProps, goBack } from 'src/navigators/SettingsNavigator';

import PhrasesDataSource from 'src/models/phrases';

import styles from './styles';
import HeaderButton from 'src/components/HeaderButton';

interface State {
  text: string;
}

class SuggestionForm extends React.Component<ColoredScreenProps, State> {
  static navigationOptions = (args: ColoredScreenProps) => ({
    headerLeft: (
      <HeaderButton color={args.navigation.color.light} onPress={goBack(args)}>
        Cancel
      </HeaderButton>
    ),
    headerRight: (
      <HeaderButton
        color={args.navigation.color.light}
        onPress={args.navigation.getParam('onPressDone')}
      >
        Done
      </HeaderButton>
    ),
  });

  dataSource: PhrasesDataSource = new PhrasesDataSource();
  state = {
    text: '',
  };

  constructor(props: ColoredScreenProps) {
    super(props);
    props.navigation.setParams({
      onPressDone: this.onPressDone,
    });
  }

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

export default SuggestionForm;
