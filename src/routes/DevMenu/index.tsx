import React from 'react';
import { View, ActivityIndicator, Switch, Text } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { compose } from '@typed/compose';
import Config from 'react-native-config';

import t, { DevMenu as strings, Global as globalStrings } from 'src/locales';
import { goBack } from 'src/utils/navigation';
import { withAds, AdsConsumerProps } from 'src/utils/hocs/withAds';
import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';
import routeNames from 'src/routes';

import googleLogin from 'src/models/auth';

import ListItem from 'src/components/ListItem';
import HeaderButton from 'src/components/HeaderButton';

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

  onPressRedditPhrases = () => {
    const { dark, light } = this.props.navigation.color;
    const { navigation } = this.props;
    navigation.navigate(routeNames.RedditPhrases, { dark, light });
  };

  onPressLogout = async () => {
    this.setState({ isLoading: true });
    await GoogleSignin.signOut();
    this.setState({ isLoading: false, isSignedIn: false });
  };

  // TODO: ShowAds Switch
  renderSignedIn = () => (
    <React.Fragment>
      <ListItem
        label={t(strings.reviewRedditPhrases)}
        onPress={this.onPressRedditPhrases}
      />
      <ListItem label={t(strings.showAds)} style={styles.switchContainer}>
        <Switch
          value={this.props.showAds}
          trackColor={{ true: this.props.navigation.color.dark } as any}
          disabled
        />
      </ListItem>
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

const Enhanced = compose(withAds)(DevMenu);
Enhanced.navigationOptions = (props: ColoredScreenProps) => ({
  headerRight: (
    <HeaderButton color={props.navigation.color.light} onPress={goBack(props)}>
      {t(globalStrings.done)}
    </HeaderButton>
  ),
});

export default Enhanced;
