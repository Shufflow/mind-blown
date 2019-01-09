import React from 'react';
import { ActivityIndicator, View, Text, ScrollView } from 'react-native';
import { compose } from '@typed/compose';

import withSettingsModal, {
  SettingsModalProps,
} from 'src/utils/hocs/withSettingsModal';
import withHeader from 'src/utils/hocs/withHeader';

import { Colors } from 'src/utils/styles';
import icons from 'src/assets/icons';

import RedditDataSource, { RedditPhrase } from 'src/models/reddit';

import SVGButton from 'src/components/SVGButton';

import Translation from './components/Translation';
import styles from './styles';

const emptyTranslation = { language: 'en', content: '' };

interface State {
  isLoading: boolean;
  phrase: RedditPhrase | null;
  translations: Array<{ language: string; content: string }>;
}

class RedditPhrases extends React.Component<SettingsModalProps, State> {
  state = {
    isLoading: false,
    phrase: null,
    translations: [emptyTranslation],
  };

  dataSource = new RedditDataSource();
  translations: Array<{ language: string; content: string }> = [];

  componentDidMount() {
    this.loadPhrase();
  }

  loadPhrase = async () => {
    this.setState({ isLoading: true });
    const phrase = await this.dataSource.loadPhrase();
    this.setState({ isLoading: false, phrase });
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
    const { dark, light } = this.props;
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

  render() {
    const { isLoading, phrase } = this.state;
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
        {!!phrase && (
          <View>
            <Text style={styles.text}>{(phrase as RedditPhrase).content}</Text>
            <Text style={styles.text}>
              Score - {(phrase as RedditPhrase).score}
            </Text>
          </View>
        )}
        {!isLoading && (
          <React.Fragment>
            {this.renderTranslations()}
            <SVGButton
              icon={icons.plus}
              color={Colors.darkGray}
              style={styles.plusButton}
              onPress={this.onPressAddTranslation}
              fillAll
            />
          </React.Fragment>
        )}
      </ScrollView>
    );
  }
}

const enhance = compose(
  withSettingsModal('Review Reddit Phrases'),
  withHeader({
    addMargin: false,
    rightButton: {
      label: 'Done',
      onPress: ({ dismiss }: SettingsModalProps) => {
        dismiss();
      },
    },
    title: 'Reddit Phrase',
  }),
);

export default enhance(RedditPhrases);
