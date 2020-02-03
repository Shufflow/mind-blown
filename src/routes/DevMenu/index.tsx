import React from 'react';
import { View, ActivityIndicator, Switch, Text } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import Config from 'react-native-config';

import t, { DevMenu as strings } from '@locales';
import RouteName from '@routes';
import { withAds, AdsConsumerProps } from '@hocs/withAds';
import withDoneButton from '@hocs/withDoneButton';
import { compose } from '@utils/compose';

import ListItem from '@components/ListItem';

import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';
import Analytics from 'src/models/analytics';

import googleLogin from 'src/models/auth';
import IAP from 'src/models/iap';

import styles from './styles';

interface State {
  isLoading: boolean;
  isSignedIn: boolean;
}

interface Props extends ColoredScreenProps, AdsConsumerProps {}

class DevMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      isSignedIn: false,
    };
  }

  componentDidMount() {
    Analytics.currentScreen(RouteName.DevMenu);
    this.checkSignIn();
  }

  onPressSignIn = async () => {
    this.setState({ isLoading: true });
    await googleLogin();
    await this.checkSignIn();
  };

  checkSignIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    this.setState({ isLoading: false, isSignedIn });
  };

  onPressModeratePhrases = () => {
    const { dark, light } = this.props.navigation.color;
    const { navigation } = this.props;
    navigation.navigate(RouteName.ModeratePhrases, { dark, light });
  };

  onPressLogout = async () => {
    this.setState({ isLoading: true });
    await GoogleSignin.signOut();
    this.setState({ isLoading: false, isSignedIn: false });
  };

  onToggleAdFree = (value: boolean) => {
    IAP.forceAdFree = !value;
    this.props.checkIsAdFree();
  };

  onPressCrash = () => {
    throw new Error('forced crash');
  };

  renderSignedIn = () => (
    <React.Fragment>
      <ListItem
        label={t(strings.reviewPhrases)}
        onPress={this.onPressModeratePhrases}
      />
      <ListItem label={t(strings.showAds)} style={styles.switchContainer}>
        <Switch
          value={this.props.showAds}
          trackColor={{ true: this.props.navigation.color.dark } as any}
          onValueChange={this.onToggleAdFree}
        />
      </ListItem>
      <ListItem label={t(strings.forceCrash)} onPress={this.onPressCrash} />
      <ListItem
        label={t(strings.logout)}
        onPress={this.onPressLogout}
        style={styles.logout}
      />
    </React.Fragment>
  );

  renderSignedOff = () => (
    <GoogleSigninButton
      onPress={this.onPressSignIn}
      size={GoogleSigninButton.Size.Wide}
      style={styles.googleButton}
    />
  );

  render() {
    const { isLoading, isSignedIn } = this.state;
    const {
      navigation: {
        color: { dark, light },
      },
    } = this.props;
    return (
      <View style={styles.container(light)}>
        {isLoading ? (
          <ActivityIndicator color={dark} size='large' />
        ) : isSignedIn ? (
          this.renderSignedIn()
        ) : (
          this.renderSignedOff()
        )}
        <Text style={styles.footer}>
          {dark} - {light}
          {`\n`}
          {Config.FIREBASE_PROJECT_ID}
        </Text>
      </View>
    );
  }
}

const enhance = compose(withDoneButton, withAds);
export default enhance(DevMenu);
