import React from 'react';
import { View, ActivityIndicator, Switch, Text } from 'react-native';
import { GoogleSigninButton } from '@react-native-community/google-signin';
import Config from 'react-native-config';
import hooked from 'react-hook-hooked';

import t, { DevMenu as strings } from '@locales';
import { withAds } from '@hocs/withAds';
import withDoneButton from '@hocs/withDoneButton';
import { compose } from '@utils/compose';

import ListItem from '@components/ListItem';

import hook, { HookedProps, Props } from './hooks';
import styles from './styles';

type CombinedProps = HookedProps & Props;
const DevMenu = ({
  handlePressCrash,
  handlePressLogout,
  handlePressModeratePhrases,
  handlePressModerateSuggestions,
  handlePressSignIn,
  handleToggleAdFree,
  isLoading,
  isSignedIn,
  navigation: {
    color: { dark, light },
  },
  showAds,
}: CombinedProps) => {
  const renderSignedIn = () => (
    <React.Fragment>
      <ListItem
        label={t(strings.reviewPhrases)}
        onPress={handlePressModeratePhrases}
      />
      <ListItem
        label={t(strings.moderateSuggestions)}
        onPress={handlePressModerateSuggestions}
      />
      <ListItem label={t(strings.showAds)} style={styles.switchContainer}>
        <Switch
          value={showAds}
          trackColor={{ true: dark } as any}
          onValueChange={handleToggleAdFree}
        />
      </ListItem>
      <ListItem label={t(strings.forceCrash)} onPress={handlePressCrash} />
      <ListItem
        label={t(strings.logout)}
        onPress={handlePressLogout}
        style={styles.logout}
      />
    </React.Fragment>
  );

  const renderSignedOff = () => (
    <GoogleSigninButton
      onPress={handlePressSignIn}
      size={GoogleSigninButton.Size.Wide}
      style={styles.googleButton}
    />
  );

  return (
    <View style={styles.container(light)}>
      {isLoading ? (
        <ActivityIndicator color={dark} size='large' />
      ) : isSignedIn ? (
        renderSignedIn()
      ) : (
        renderSignedOff()
      )}
      <Text style={styles.footer}>
        {dark} - {light}
        {`\n`}
        {Config.FIREBASE_PROJECT_ID}
      </Text>
    </View>
  );
};

const enhance = compose(
  hooked<CombinedProps, HookedProps>(hook),
  withDoneButton,
  withAds,
);
export default enhance(DevMenu);
