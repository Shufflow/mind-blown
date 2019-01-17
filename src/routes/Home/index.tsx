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

import PhrasesDataSource, { Phrase as PhraseType } from 'src/models/phrases';
import AdIds from 'src/models/ads';
import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';
import { getColor } from 'src/models/assets';
import routeNames from 'src/routes';

import icons from 'src/assets/icons';
import SVGButton from 'src/components/SVGButton';
import AdBanner from 'src/components/AdBanner';

import Phrase from './components/Phrase';
import ThumbDownButton from './components/ThumbDownButton';
import ThumbUpButton from './components/ThumbUpButton';
import styles from './styles';

enum SelectedThumb {
  Up = 'up',
  Down = 'down',
}

interface Props extends LocaleConsumerProps, NavigationScreenProps {}

interface State {
  bgColor: string;
  fgColor: string;
  isDark: boolean;
  phrase: PhraseType | null;
  selectedThumb: SelectedThumb | null;
}

class Home extends React.Component<Props, State> {
  mounted = false;
  dataSource: PhrasesDataSource;

  constructor(props: Props) {
    super(props);

    this.dataSource = new PhrasesDataSource();
    this.state = {
      ...this.genColors(),
      phrase: null,
      selectedThumb: null,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.loadPhrase();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  genColors = () => {
    const { dark, light } = getColor();
    const isDark = !!Math.round(Math.random());

    return {
      isDark,
      bgColor: isDark ? dark : light,
      fgColor: isDark ? light : dark,
    };
  };

  loadPhrase = async () => {
    this.setState({ phrase: null });

    const phrase = await this.dataSource.getRandomPhrase();
    if (this.mounted) {
      this.setState({ phrase, selectedThumb: null });
    }
  };

  getRandomPhrase = async () => {
    this.setState(this.genColors());
    await this.loadPhrase();
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

  render() {
    const { bgColor, fgColor, isDark, phrase, selectedThumb } = this.state;
    return (
      <TouchableWithoutFeedback onPress={this.getRandomPhrase}>
        <View style={[styles.container, { backgroundColor: bgColor }]}>
          <AdBanner adUnitID={AdIds.homeTopBanner} />
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
                style={styles.activityIndicator}
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
          <AdBanner adUnitID={AdIds.homeBottomBanner} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const enhance = compose(withLocale);
export default enhance(Home);
