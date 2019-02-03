import React from 'react';
import { View, StatusBar, ScrollView, Linking } from 'react-native';

import RouteName from '@routes';
import t, { About as strings } from '@locales';
import withDoneButton from '@hocs/withDoneButton';
import Constants from '@utils/constants';

import ListItem from '@components/ListItem';
import Button, { ButtonTheme } from '@components/Button';
import AdBanner from '@components/AdBanner';

import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';

import AdIds from 'src/models/ads';

import styles from './styles';

import { version } from '../../../package.json';

class About extends React.PureComponent<ColoredScreenProps> {
  handleNavigate = (route: RouteName) => () => {
    this.props.navigation.navigate(route);
  };

  handleOpenURL = (url: string) => async () => {
    await Linking.openURL(url);
  };

  render() {
    const {
      navigation: {
        color: { light },
      },
    } = this.props;
    return (
      <View style={styles.container(light)}>
        <StatusBar barStyle='light-content' />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View>
            <ListItem
              label={t(strings.licenses)}
              onPress={this.handleNavigate(RouteName.Licenses)}
            />
            <ListItem label={t(strings.version)} style={styles.itemMarginTop}>
              {version}
            </ListItem>
          </View>
          <View style={styles.footerContainer}>
            <Button
              hasShadow={false}
              theme={ButtonTheme.minimalist}
              onPress={this.handleOpenURL(Constants.repoURL)}
              style={styles.footerLink}
              textStyle={styles.footerLinkText}
            >
              {t(strings.madeBy)}
            </Button>
            <Button
              hasShadow={false}
              theme={ButtonTheme.minimalist}
              onPress={this.handleOpenURL(Constants.agnesURL)}
              style={styles.footerLink}
              textStyle={styles.footerLinkText}
            >
              {t(strings.artBy)}
            </Button>
          </View>
        </ScrollView>
        <AdBanner adUnitID={AdIds.about} />
      </View>
    );
  }
}

export default withDoneButton(About);
