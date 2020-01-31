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
import Analytics from 'src/models/analytics';

import AdIds from 'src/models/ads';

import styles from './styles';

import { version } from '../../../package.json';

class About extends React.PureComponent<ColoredScreenProps> {
  componentDidMount() {
    Analytics.currentScreen(RouteName.About);
  }

  handleNavigate = (route: RouteName) => () => {
    this.props.navigation.navigate(route);
  };

  handlePressStoreReview = async () => {
    await Analytics.appRating();
    await Linking.openURL(Constants.storeReview);
  };

  handlePressAuthor = async () => {
    await Analytics.selectAuthor();
    await Linking.openURL(Constants.repoURL);
  };

  handlePressDesigner = async () => {
    await Analytics.selectDesigner();
    await Linking.openURL(Constants.agnesURL);
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
            <ListItem
              label={t(strings.storeReview)}
              onPress={this.handlePressStoreReview}
            />
            <ListItem label={t(strings.version)} style={styles.itemMarginTop}>
              {version}
            </ListItem>
          </View>
          <View style={styles.footerContainer}>
            <Button
              hasShadow={false}
              theme={ButtonTheme.minimalist}
              onPress={this.handlePressAuthor}
              style={styles.footerLink}
              textStyle={styles.footerLinkText}
            >
              {t(strings.madeBy)}
            </Button>
            <Button
              hasShadow={false}
              theme={ButtonTheme.minimalist}
              onPress={this.handlePressDesigner}
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
