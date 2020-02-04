import React from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';

import RouteName from '@routes';
import t, { Global as strings } from '@locales';

import HeaderButton from '@components/HeaderButton';
import AdBanner from '@components/AdBanner';

import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';
import Analytics from 'src/models/analytics';

import AdIds from 'src/models/ads';
import PhrasesDataSource from 'src/models/phrases';

import styles from './styles';

class SuggestionForm extends React.PureComponent<ColoredScreenProps> {
  static navigationOptions = (args: ColoredScreenProps) => ({
    headerRight: args.navigation.getParam('isLoading', false) ? (
      <ActivityIndicator
        color={args.navigation.color.light}
        style={styles.loading}
      />
    ) : (
      <HeaderButton
        color={args.navigation.color.light}
        onPress={args.navigation.getParam('onPressDone')}
      >
        {t(strings.send)}
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

  componentDidMount() {
    Analytics.currentScreen(RouteName.SendSuggestion);
  }

  onChangeText = (text: string) => {
    this.text = text;
  };

  onPressDone = async () => {
    if (!this.text) {
      return;
    }

    const { navigation } = this.props;
    navigation.setParams({ isLoading: true });
    const id = await this.dataSource.sendSuggestion(this.text);
    navigation.setParams({ isLoading: false });
    navigation.goBack();
    Analytics.sentSuggestion(id);
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
