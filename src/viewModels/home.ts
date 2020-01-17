import { NavigationInjectedProps } from 'react-navigation';
import lodash from 'lodash';
import RNTextSize from 'react-native-text-size';
import { Subject, combineLatest, Subscription, Observable } from 'rxjs';
import { throttleTime, flatMap, share } from 'rxjs/operators';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import RouteName from '@routes';
import { ViewModel, SetState } from '@components/SmartComponent';
import { LocaleConsumerProps } from '@hocs/withLocale';
import { asyncBinarySearch } from '@utils/search';

import Fonts from 'src/models/fonts';
import { getColor } from 'src/models/assets';
import PhrasesDataSource, {
  Phrase as PhraseType,
  Phrase,
} from 'src/models/phrases';
import Analytics from 'src/models/analytics';

export enum SelectedThumb {
  Up = 'up',
  Down = 'down',
}

export interface Props extends LocaleConsumerProps, NavigationInjectedProps {}

interface FontSpec {
  fontFamily: string;
  fontSize: number;
}

interface Size {
  height: number;
  width: number;
}

export interface State {
  bgColor: string;
  fgColor: string;
  font: FontSpec;
  hasError: boolean;
  isDark: boolean;
  phrase: PhraseType | null;
  selectedThumb: SelectedThumb | null;
}

const Constants = {
  desiredFontSize: 40,
  loaderTimeout: 200,
  sizeThrottleTimeout: 200,
};

class HomeViewModel extends ViewModel<Props, State> {
  dataSource = new PhrasesDataSource();
  fontFamily = '';
  sizeSubject = new Subject<Size>();
  phraseSubject = new Subject<Phrase | null>();
  subscription: Subscription;
  stateObservable: Observable<Partial<State>>;
  viewShot?: ViewShot;
  fonts = new Fonts();

  constructor(
    getProps: () => Props,
    getState: () => State,
    setState: SetState<Props, State>,
  ) {
    super(getProps, getState, setState);
    Analytics.currentScreen(RouteName.Home);

    this.stateObservable = combineLatest(
      this.sizeSubject.pipe(throttleTime(Constants.sizeThrottleTimeout)),
      this.phraseSubject,
    ).pipe(
      flatMap(async ([size, phrase]) => {
        const font = await this.getFont(this.getContent(phrase), size);
        return {
          ...this.genColors(),
          font,
          phrase,
          selectedThumb: null,
        };
      }),
      share(),
    );

    this.subscription = this.stateObservable.subscribe(this.setState as any);
  }

  getInitialState = () => ({
    ...this.genColors(),
    font: {
      fontFamily: this.fontFamily,
      fontSize: 0,
    },
    hasError: false,
    phrase: null,
    selectedThumb: null,
  });

  getRandomPhrase = async () => {
    const timeout = setTimeout(() => {
      this.setState({ hasError: false, phrase: null });
    }, Constants.loaderTimeout);

    try {
      const phrase = await this.dataSource.getRandomPhrase();
      phrase && Analytics.viewPhrase(phrase.id);
      this.phraseSubject.next(phrase);
      clearTimeout(timeout);
    } catch (e) {
      clearTimeout(timeout);
      this.setState({ hasError: true });
    }
  };

  getPhraseContent = (): string => {
    const { phrase } = this.getState();
    return this.getContent(phrase);
  };

  handlePhraseContainerSize = (size: Size) => {
    this.sizeSubject.next(size);
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
      await Promise.all([
        this.dataSource.reviewPhrase(phrase.id, review),
        Analytics.reviewPhrase(phrase.id, review),
      ]);
    } catch (e) {
      this.setState({
        selectedThumb: null,
      });
    }
  };

  handlePressSettings = () => {
    this.getProps().navigation.navigate(RouteName.Settings);
  };

  handleViewShotRef = (ref: ViewShot | null) => {
    if (ref) {
      this.viewShot = ref;
    }
  };

  handlePressShare = async () => {
    if (!this.viewShot || !this.viewShot.capture) {
      return;
    }

    try {
      const url = await this.viewShot.capture();

      const { app } = await Share.open({
        type: 'image/png',
        url: `file://${url}`,
      });

      Analytics.sharePhrase(this.getState().phrase!.id, app);
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  };

  private getFont = async (text: string, size: Size): Promise<FontSpec> => {
    this.fontFamily = await this.fonts.getRandomFont();

    const range = lodash.range(Constants.desiredFontSize);
    const fontSize = await asyncBinarySearch(
      range,
      this.compareContainerHeight,
      { size, text, fontFamily: this.fontFamily },
    );

    return { fontFamily: this.fontFamily, fontSize };
  };

  private getContent = (phrase: Phrase | null) => {
    const { locale } = this.getProps();
    return phrase ? phrase[locale] || phrase.en : '';
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

  private compareContainerHeight = async (
    fontSize: number,
    { size: { width, height }, text }: { size: Size; text: string },
  ) => {
    const size = await RNTextSize.measure({
      fontSize,
      text,
      width,
      fontFamily: this.fontFamily,
    });

    return size.height - height;
  };
}

export default HomeViewModel;
