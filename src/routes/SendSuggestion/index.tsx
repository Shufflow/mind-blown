import React from 'react';
import { View, TextInput } from 'react-native';

import { goBack } from 'src/utils/navigation';
import t, { Global as strings } from 'src/locales';
import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';

import AdIds from 'src/models/ads';
import PhrasesDataSource from 'src/models/phrases';
import HeaderButton from 'src/components/HeaderButton';
import AdBanner from 'src/components/AdBanner';

import styles from './styles';

class SuggestionForm extends React.PureComponent<ColoredScreenProps> {
  static navigationOptions = (args: ColoredScreenProps) => ({
    headerLeft: (
      <HeaderButton color={args.navigation.color.light} onPress={goBack(args)}>
        {t(strings.cancel)}
      </HeaderButton>
    ),
    headerRight: (
      <HeaderButton
        color={args.navigation.color.light}
        onPress={args.navigation.getParam('onPressDone')}
      >
        {t(strings.done)}
      </HeaderButton>
    ),
  });

  dataSource: PhrasesDataSource = new PhrasesDataSource();
  text = '';

  constructor(props: ColoredScreenProps) {
    super(props);
    props.navigation.setParams({
      onPressDone: this.onPressDone,
    });
  }

  onChangeText = (text: string) => {
    this.text = text;
  };

  onPressDone = async () => {
    if (this.text) {
      await this.dataSource.sendSuggestion(this.text);
    }

    this.props.navigation.goBack();
  };

  render() {
    const {
      navigation: { color },
    } = this.props;

    return (
      <View style={styles.container(color.light)}>
        <TextInput
          onChangeText={this.onChangeText}
          style={styles.textInput}
          autoFocus
          editable
          multiline
        />
        <AdBanner adUnitID={AdIds.settingsBottomBanner} />
      </View>
    );
  }
}

export default SuggestionForm;
