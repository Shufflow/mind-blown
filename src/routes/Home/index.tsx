import { compose } from '@typed/compose';
import { isEqual } from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { AdMobBanner } from 'react-native-admob';

import PhrasesDataSource, { Phrase as PhraseType } from 'src/models/phrases';
import AdIds from 'src/models/ads';
import withColor, { ColorProps } from 'src/utils/hocs/withColors';
import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';
import routeNames from 'src/routes';

import icons from 'src/assets/icons';
import SVGButton from 'src/components/SVGButton';

import Phrase from './components/Phrase';
import ThumbDownButton from './components/ThumbDownButton';
import ThumbUpButton from './components/ThumbUpButton';
import styles from './styles';

enum SelectedThumb {
  Up = 'up',
  Down = 'down',
}

interface Props
  extends LocaleConsumerProps,
    ColorProps,
    NavigationScreenProps {}

interface State {
  phrase: PhraseType | null;
  selectedThumb: SelectedThumb | null;
}

class Home extends React.Component<Props, State> {
  dataSource: PhrasesDataSource;

  constructor(props: Props) {
    super(props);

    this.dataSource = new PhrasesDataSource();
    this.state = {
      phrase: null,
      selectedThumb: null,
    };
  }

  componentDidMount() {
    this.getRandomPhrase();
  }

  getRandomPhrase = async () => {
    this.props.newColor();
    this.setState({ phrase: null });

    const phrase = await this.dataSource.getRandomPhrase();
    this.setState({ phrase, selectedThumb: null });
  };

  onPressReview = (review: boolean) => async () => {
    const { phrase } = this.state;
    if (!phrase) {
      return;
    }

    this.setState({
      selectedThumb: review ? SelectedThumb.Up : SelectedThumb.Down,
    });

    try {
      await this.dataSource.reviewPhrase(phrase.id, review);
    } catch (e) {
      this.setState({
        selectedThumb: null,
      });
    }
  };

  getPhraseContent = (): string => {
    const { locale } = this.props;
    const { phrase } = this.state;
    return phrase ? phrase[locale] || phrase.en : '';
  };

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return (
      (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) &&
      !!nextState.phrase
    );
  }

  onPressSettings = () => {
    this.props.navigation.navigate(routeNames.Settings);
  };

  onFailToLoadAd = (e: Error) => {
    if (__DEV__) {
      // tslint:disable-next-line: no-console
      console.warn(e);
    }
  };

  render() {
    const { bgColor, isDark, fgColor } = this.props;
    const { phrase, selectedThumb } = this.state;
    return (
      <TouchableWithoutFeedback onPress={this.getRandomPhrase}>
        <View style={[styles.container, { backgroundColor: bgColor }]}>
          <AdMobBanner
            adSize='fullBanner'
            adUnitID={AdIds.homeTopBanner}
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={this.onFailToLoadAd}
          />
          <SafeAreaView style={styles.content}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <SVGButton
              color={fgColor}
              fillAll
              icon={icons.cog}
              onPress={this.onPressSettings}
              style={styles.settingsButton}
            />
            {!!phrase ? (
              <Phrase content={this.getPhraseContent()} color={fgColor} />
            ) : (
              <ActivityIndicator
                color={fgColor}
                size='large'
                style={{ alignSelf: 'center' }}
              />
            )}
            <View style={styles.footer}>
              <ThumbDownButton
                color={fgColor}
                isSelected={selectedThumb === SelectedThumb.Down}
                onPress={this.onPressReview(false)}
              />
              <ThumbUpButton
                color={fgColor}
                isSelected={selectedThumb === SelectedThumb.Up}
                onPress={this.onPressReview(true)}
              />
            </View>
          </SafeAreaView>
          <AdMobBanner
            adSize='fullBanner'
            adUnitID={AdIds.homeBottomBanner}
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={this.onFailToLoadAd}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const enhance = compose(
  withLocale,
  withColor,
);
export default enhance(Home);
