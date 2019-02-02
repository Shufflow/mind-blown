import { NavigationScreenProps } from 'react-navigation';

import RouteName from 'src/routes';
import { LocaleConsumerProps } from 'src/utils/hocs/withLocale';

import { getColor } from 'src/models/assets';
import PhrasesDataSource, { Phrase as PhraseType } from 'src/models/phrases';

import { ViewModel } from 'src/components/SmartComponent';

export enum SelectedThumb {
  Up = 'up',
  Down = 'down',
}

export interface Props extends LocaleConsumerProps, NavigationScreenProps {}

export interface State {
  bgColor: string;
  fgColor: string;
  hasError: boolean;
  isDark: boolean;
  phrase: PhraseType | null;
  selectedThumb: SelectedThumb | null;
}

const Constants = {
  loaderTimeout: 200,
};

class HomeViewModel extends ViewModel<Props, State> {
  dataSource = new PhrasesDataSource();

  getInitialState = () => ({
    ...this.genColors(),
    hasError: false,
    phrase: null,
    selectedThumb: null,
  });

  loadPhrase = async () => {
    const timeout = setTimeout(() => {
      this.setState({ hasError: false, phrase: null });
    }, Constants.loaderTimeout);

    try {
      const phrase = await this.dataSource.getRandomPhrase();
      clearTimeout(timeout);
      this.setState({ hasError: false, phrase, selectedThumb: null });
    } catch (e) {
      clearTimeout(timeout);
      this.setState({ hasError: true });
    }
  };

  getRandomPhrase = async () => {
    await this.loadPhrase();
    this.setState(this.genColors());
  };

  getPhraseContent = (): string => {
    const { locale } = this.props;
    const { phrase } = this.getState();
    return phrase ? phrase[locale] || phrase.en : '';
  };

  handlePressReview = (review: boolean) => async () => {
    const { phrase } = this.getState();
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

  handlePressSettings = () => {
    this.props.navigation.navigate(RouteName.Settings);
  };

  private genColors = () => {
    const { dark, light } = getColor();
    const isDark = !!Math.round(Math.random());

    return {
      isDark,
      bgColor: isDark ? dark : light,
      fgColor: isDark ? light : dark,
    };
  };
}

export default HomeViewModel;
