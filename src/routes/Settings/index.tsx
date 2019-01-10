import { compose } from '@typed/compose';
import React from 'react';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { NavigationScreenProps } from 'react-navigation';

import withColor, { ColorProps } from 'src/utils/hocs/withColors';
import withHeader from 'src/utils/hocs/withHeader';
import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';

import googleLogin from 'src/models/auth';
import routeNames from 'src/routes';

import Dev from 'src/components/Dev';
import ListItem from 'src/components/ListItem';

import LanguagePicker from './components/LanguagePicker';
import styles from './styles';

interface Props
  extends LocaleConsumerProps,
    ColorProps,
    NavigationScreenProps {}

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
    const { dark, light, navigation } = this.props;
    navigation.navigate(routeName, {
      dark,
      light,
    });
  };

  render() {
    const { dark, light, locale, setLocale } = this.props;
    const { isSignedIn } = this.state;

    return (
      <React.Fragment>
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
        </Dev>
      </React.Fragment>
    );
  }
}

const enhance = compose(
  withColor,
  withLocale,
  withHeader({
    rightButton: {
      label: 'Done',
      onPress: ({ navigation }: Props) => {
        navigation.goBack();
      },
    },
    title: 'Settings',
  }),
);

export default enhance(Settings);
