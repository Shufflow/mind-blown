import React from 'react';
import { ActivityIndicator, View, Text, ScrollView } from 'react-native';
import { isEqual, omit } from 'lodash';

import { Colors } from 'src/utils/styles';
import icons from 'src/assets/icons';

import RedditDataSource, { RedditPhrase } from 'src/models/reddit';
import { ColoredScreenProps, goBack } from 'src/navigators/SettingsNavigator';

import SVGButton from 'src/components/SVGButton';
import Button from 'src/components/Button';
import HeaderButton from 'src/components/HeaderButton';

import Translation from './components/Translation';
import styles from './styles';

const emptyTranslation = { language: 'pt-BR', content: '' };

interface State {
  isLoading: boolean;
  phrase: RedditPhrase | null;
  translations: Array<{ language: string; content: string }>;
}

class RedditPhrases extends React.Component<ColoredScreenProps, State> {
  static navigationOptions = (args: ColoredScreenProps) => ({
    headerRight: (
      <HeaderButton color={args.navigation.color.light} onPress={goBack(args)}>
        Done
      </HeaderButton>
    ),
  });

  dataSource = new RedditDataSource();
  translations: Array<{ language: string; content: string }> = [];

  constructor(props: ColoredScreenProps) {
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

  shouldComponentUpdate(nextProps: ColoredScreenProps, nextState: State) {
    return (
      !isEqual(this.props, nextProps) ||
      !isEqual(
        omit(this.state, 'translations.content'),
        omit(nextState, 'translations.content'),
      )
    );
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
    const {
      navigation: { color },
    } = this.props;

    const isEmpty = !isLoading && !phrase;
    return (
      <ScrollView
        style={styles.container(color.light)}
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
            <View style={styles.content}>
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
            </View>
            <View style={styles.footer}>
              <Button
                onPress={this.onPressDiscard}
                style={styles.discardButton}
              >
                Discard
              </Button>
              <Button onPress={this.onPressSave} style={styles.saveButton}>
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

export default RedditPhrases;
