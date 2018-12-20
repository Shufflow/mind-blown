import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { getColor } from 'src/models/assets';
import locale from 'src/models/locale';
import PhrasesDataSource, { Phrase as PhraseType } from 'src/models/phrases';

import Phrase from './components/Phrase';
import ThumbDownButton from './components/ThumbDownButton';
import ThumbUpButton from './components/ThumbUpButton';
import styles from './styles';

enum SelectedThumb {
  Up = 'up',
  Down = 'down',
}

interface State {
  backgroundColor: string;
  phrase: PhraseType | null;
  selectedThumb: SelectedThumb | null;
  textColor: string;
}

class Home extends React.Component<{}, State> {
  dataSource: PhrasesDataSource;

  constructor(props: {}) {
    super(props);

    this.dataSource = new PhrasesDataSource();
    this.state = {
      backgroundColor: 'transparent',
      phrase: null,
      selectedThumb: null,
      textColor: 'white',
    };
  }

  componentDidMount() {
    this.getRandomPhrase();
  }

  getRandomPhrase = async () => {
    const color = getColor();
    this.setState({
      backgroundColor: color.bg,
      textColor: color.fg,
    });

    const phrase = await this.dataSource.getRandomPhrase(locale);
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

  render() {
    const { backgroundColor, phrase, selectedThumb, textColor } = this.state;
    const phraseContent = phrase ? phrase.content : '';
    return (
      <TouchableWithoutFeedback onPress={this.getRandomPhrase}>
        <SafeAreaView style={[styles.content, { backgroundColor }]}>
          <ActivityIndicator
            animating={!phrase}
            color={textColor}
            size='large'
            hidesWhenStopped
          />
          <Phrase content={phraseContent} color={textColor} />
          <View style={styles.footer}>
            <ThumbDownButton
              color={textColor}
              isSelected={selectedThumb === SelectedThumb.Down}
              onPress={this.onPressReview(false)}
            />
            <ThumbUpButton
              color={textColor}
              isSelected={selectedThumb === SelectedThumb.Up}
              onPress={this.onPressReview(true)}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

export default Home;
