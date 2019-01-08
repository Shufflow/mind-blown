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

import PhrasesDataSource, { Phrase as PhraseType } from 'src/models/phrases';
import withColor, { ColorProps } from 'src/utils/hocs/withColors';
import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';

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

interface Props extends LocaleConsumerProps, ColorProps {
  onPressSettings: () => void;
}

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

  render() {
    const { bgColor, isDark, fgColor, onPressSettings } = this.props;
    const { phrase, selectedThumb } = this.state;
    return (
      <TouchableWithoutFeedback onPress={this.getRandomPhrase}>
        <SafeAreaView style={[styles.content, { backgroundColor: bgColor }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          <SVGButton
            color={fgColor}
            fillAll
            icon={icons.cog}
            onPress={onPressSettings}
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
      </TouchableWithoutFeedback>
    );
  }
}

const enhance = compose(
  withLocale,
  withColor,
);
export default enhance(Home);
