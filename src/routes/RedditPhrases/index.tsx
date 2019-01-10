import React from 'react';
import { ActivityIndicator, View, Text, ScrollView } from 'react-native';
import { compose } from '@typed/compose';
import { NavigationScreenProps } from 'react-navigation';

import withHeader from 'src/utils/hocs/withHeader';

import { Colors } from 'src/utils/styles';
import icons from 'src/assets/icons';

import RedditDataSource, { RedditPhrase } from 'src/models/reddit';

import SVGButton from 'src/components/SVGButton';
import Button from 'src/components/Button';

import Translation from './components/Translation';
import styles from './styles';

const emptyTranslation = { language: 'en', content: '' };

interface State {
  isLoading: boolean;
  phrase: RedditPhrase | null;
  translations: Array<{ language: string; content: string }>;
}

class RedditPhrases extends React.Component<NavigationScreenProps, State> {
  dataSource = new RedditDataSource();
  translations: Array<{ language: string; content: string }> = [];

  constructor(props: NavigationScreenProps) {
    super(props);
    this.state = {
      isLoading: false,
      phrase: null,
      translations: [emptyTranslation],
    };
  }

  componentDidMount() {
    this.loadPhrase();
  }

  loadPhrase = async () => {
    this.setState({ isLoading: true });
    const phrase = await this.dataSource.loadPhrase();
    this.setState({
      phrase,
      isLoading: false,
      translations: [emptyTranslation],
    });
  };

  handleTranslation = (idx: number) => (language: string, content: string) => {
    const { translations } = this.state;
    translations[idx] = { language, content };
    this.setState({ translations });
  };

  onPressAddTranslation = () => {
    this.setState(({ translations }) => ({
      translations: [...translations, emptyTranslation],
    }));
  };

  handleRemoveTranslation = (idx: number) => () => {
    this.setState(({ translations }) => {
      return {
        translations: translations.filter((_, i) => idx !== i),
      };
    });
  };

  renderTranslations = (): Array<React.ReactElement<any>> => {
    const dark = this.props.navigation.getParam('dark');
    const light = this.props.navigation.getParam('light');
    return this.state.translations.map(({ language, content }, idx) => (
      <Translation
        key={`${language}-${content}-${idx.toString()}`}
        content={content}
        dark={dark}
        language={language}
        light={light}
        onRemove={idx === 0 ? null : this.handleRemoveTranslation(idx)}
        onTranslation={this.handleTranslation(idx)}
      />
    ));
  };

  onPressDiscard = async () => {
    const { phrase } = this.state;
    if (!phrase) {
      return;
    }

    this.setState({ isLoading: true, phrase: null });

    await this.dataSource.discardPhrase(phrase.id);
    await this.loadPhrase();
  };

  onPressSave = async () => {
    const { phrase, translations } = this.state;
    if (!phrase) {
      return;
    }

    this.setState({ isLoading: true, phrase: null });

    await this.dataSource.savePhrase(
      phrase.id,
      translations.reduce(
        (res, { language, content }) => ({
          ...res,
          [language]: content,
        }),
        {} as { [locale: string]: string },
      ),
    );
    await this.loadPhrase();
  };

  render() {
    const { isLoading, phrase } = this.state;
    const isEmpty = !isLoading && !phrase;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        {isLoading && (
          <ActivityIndicator
            color={Colors.darkGray}
            size='large'
            style={{ alignSelf: 'center' }}
          />
        )}
        {!isLoading && !!phrase && (
          <React.Fragment>
            <Text style={styles.text}>{phrase.content}</Text>
            <Text style={styles.text}>Score - {phrase.score}</Text>
            {this.renderTranslations()}
            <SVGButton
              icon={icons.plus}
              color={Colors.darkGray}
              style={styles.plusButton}
              onPress={this.onPressAddTranslation}
              fillAll
            />
            <View style={styles.footer}>
              <Button onPress={this.onPressDiscard} style={styles.footerButton}>
                Discard
              </Button>
              <Button onPress={this.onPressSave} style={styles.footerButton}>
                Save
              </Button>
            </View>
          </React.Fragment>
        )}
        {isEmpty && (
          <Text style={styles.empty}>No more phrases to review 🎉</Text>
        )}
      </ScrollView>
    );
  }
}

const enhance = compose(
  withHeader({
    addMargin: false,
    rightButton: {
      label: 'Done',
      onPress: ({ navigation }: NavigationScreenProps) => {
        navigation.goBack();
      },
    },
    title: 'Reddit Phrase',
  }),
);

export default enhance(RedditPhrases);
