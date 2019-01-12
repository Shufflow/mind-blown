import { compose } from '@typed/compose';
import React from 'react';
import { View, StatusBar } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import Config from 'react-native-config';

import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';

import googleLogin from 'src/models/auth';
import routeNames from 'src/routes';
import { ColoredScreenProps } from 'src/navigators/SettingsNavigator';

import Dev from 'src/components/Dev';
import ListItem from 'src/components/ListItem';
import HeaderButton from 'src/components/HeaderButton';

import LanguagePicker from './components/LanguagePicker';
import styles from './styles';

interface Props extends LocaleConsumerProps, ColoredScreenProps {}

interface State {
  isSignedIn: boolean;
}

class Settings extends React.Component<Props, State> {
  state = {
    isSignedIn: false,
  };

  async componentDidMount() {
    await this.checkSignIn();
  }

  onPressSignIn = async () => {
    await googleLogin();
    await this.checkSignIn();
  };

  checkSignIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    this.setState({ isSignedIn });
  };

  navigate = (routeName: string) => () => {
    const { dark, light } = this.props.navigation.color;
    const { navigation } = this.props;
    navigation.navigate(routeName, {
      dark,
      light,
    });
  };

  render() {
    const { dark, light } = this.props.navigation.color;
    const { locale, setLocale } = this.props;
    const { isSignedIn } = this.state;

    return (
      <View style={styles.container(light)}>
        <StatusBar barStyle='light-content' />
        <LanguagePicker
          dark={dark}
          light={light}
          locale={locale}
          onSelectValue={setLocale}
        />
        <ListItem
          label='Send Suggestion'
          onPress={this.navigate(routeNames.SendSuggestion)}
        />
        <Dev>
          {isSignedIn ? (
            <ListItem
              label='Review Reddit Phrases'
              onPress={this.navigate(routeNames.RedditPhrases)}
            />
          ) : (
            <GoogleSigninButton
              onPress={this.onPressSignIn}
              size={GoogleSigninButton.Size.Wide}
              style={styles.googleButton}
            />
          )}
        </Dev>
        <Dev>
          {dark} - {light}
          {`\n`}
          {Config.FIREBASE_PROJECT_ID}
        </Dev>
      </View>
    );
  }
}

const Enhanced = compose(withLocale)(Settings);
Enhanced.navigationOptions = ({ navigation }: Props) => ({
  headerRight: (
    <HeaderButton color={navigation.color.light} onPress={navigation.dismiss}>
      Done
    </HeaderButton>
  ),
});

export default Enhanced;
