import React from 'react';
import { View, TextInput } from 'react-native';
import { AdMobBanner } from 'react-native-admob';

import AdIds, { onFailToLoadAd } from 'src/models/ads';
import { ColoredScreenProps, goBack } from 'src/navigators/SettingsNavigator';

import PhrasesDataSource from 'src/models/phrases';

import styles from './styles';
import HeaderButton from 'src/components/HeaderButton';

class SuggestionForm extends React.PureComponent<ColoredScreenProps> {
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
        <AdMobBanner
          adSize='fullBanner'
          adUnitID={AdIds.settingsBottomBanner}
          testDevices={[AdMobBanner.simulatorId]}
          onAdFailedToLoad={onFailToLoadAd}
        />
      </View>
    );
  }
}

export default SuggestionForm;
