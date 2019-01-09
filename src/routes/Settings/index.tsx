import { compose } from '@typed/compose';
import React from 'react';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

import withColor, { ColorProps } from 'src/utils/hocs/withColors';
import withHeader from 'src/utils/hocs/withHeader';
import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';

import googleLogin from 'src/models/auth';

import Dev from 'src/components/Dev';

import SendSuggestion from '../SendSuggestion';
import RedditPhrases from '../RedditPhrases';

import LanguagePicker from './components/LanguagePicker';
import styles from './styles';

interface Props extends LocaleConsumerProps, ColorProps {
  dismiss: () => void;
}

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
        <SendSuggestion dark={dark} light={light} />
        <Dev>
          {isSignedIn ? (
            <RedditPhrases dark={dark} light={light} />
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
      onPress: ({ dismiss }: Props) => {
        dismiss();
      },
    },
    title: 'Settings',
  }),
);

export default enhance(Settings);
