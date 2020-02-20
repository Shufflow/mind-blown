import { useState, useCallback, useRef, useMemo } from 'react';
import {
  useLazyRef,
  useWorkerState,
  useEffectUpdate,
} from 'react-hook-utilities';
import { NavigationInjectedProps } from 'react-navigation';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import RouteName from '@routes';
import { useLocale, LocaleConsumerProps } from '@hocs/withLocale';
import {
  promiseAborter,
  usePromiseAborterRef,
  PromiseAbortedError,
  useThrottledState,
} from '@utils/hooks';
import { requestEnablePushNotifications } from '@utils/alerts';

import PhrasesDataSource, { Phrase } from 'src/models/phrases';
import Analytics from 'src/models/analytics';
import { getNewColors, ColorWithBrightness } from 'src/models/assets';
import { useFonts, Font } from 'src/models/fonts';

export enum SelectedThumb {
  Up = 'up',
  Down = 'down',
}

type Props = LocaleConsumerProps &
  NavigationInjectedProps<{ phraseId?: string }>;

interface WorkedType {
  colors: ColorWithBrightness;
  phraseData?: Phrase;
  font?: Font;
}

const usePhrases = ({ navigation }: Props) => {
  const phraseId = navigation.getParam('phraseId');
  const { locale } = useLocale();
  const { getNextFont, handlePhraseContainerSize } = useFonts();
  const viewShotRef = useRef<ViewShot>(null);
  const [selectedThumb, setThumb] = useState<SelectedThumb | null>(null);
  const model = useLazyRef(() => new PhrasesDataSource()).current;
  const abortable = usePromiseAborterRef<Phrase>();
  const {
    isLoading,
    callback: getRandomPhrase,
    data: { phraseData, colors, font },
    error,
  } = useWorkerState<WorkedType>(
    async (...args) => {
      const result = await promiseAborter(
        phraseId ? model.getPhrase(phraseId) : model.getRandomPhrase(),
        abortable,
      ).catch(e => {
        if (e !== PromiseAbortedError) {
          throw e;
        }

        return undefined;
      });

      result && Analytics.viewPhrase(result.id);
      setThumb(null);

      return {
        colors: getNewColors(),
        font: result && (await getNextFont(result[locale] ?? result.en)),
        phraseData: result,
      };
    },
    [phraseId, locale],
    { colors: getNewColors() },
  );

  useEffectUpdate(
    ([oldPhraseId]) => {
      if (!!phraseId && !oldPhraseId) {
        getRandomPhrase();
      }

      if (phraseData?.id === phraseId) {
        navigation.setParams({ phraseId: undefined });
      }
    },
    [phraseId, phraseData?.id, getRandomPhrase],
  );

  const phrase = useMemo(
    () =>
      phraseData && {
        content: phraseData[locale] ?? phraseData.en,
        id: phraseData.id,
      },
    [phraseData, locale],
  );

  const handlePressReview = useCallback(
    async (review: boolean) => {
      if (!phrase) {
        return;
      }

      if (review) {
        requestEnablePushNotifications(locale);
      }

      setThumb(review ? SelectedThumb.Up : SelectedThumb.Down);
      try {
        await Promise.all([
          model.reviewPhrase(phrase.id, review),
          Analytics.reviewPhrase(phrase.id, review),
        ]);
      } catch (e) {
        setThumb(null);
      }
    },
    [phrase, locale],
  );

  const handlePressSettings = useCallback(() => {
    navigation.navigate(RouteName.Settings);
  }, [navigation]);

  const handlePressShare = useCallback(async () => {
    if (!viewShotRef.current?.capture) {
      return;
    }

    try {
      const url = await viewShotRef.current.capture();
      const { app } = await Share.open({
        type: 'image/png',
        url: `file://${url}`,
      });

      Analytics.sharePhrase(phrase!.id, app);
      requestEnablePushNotifications(locale);
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }, [phrase, locale]);

  return {
    colors,
    error,
    font,
    getRandomPhrase,
    handlePhraseContainerSize,
    handlePressReview,
    handlePressSettings,
    handlePressShare,
    locale,
    phrase,
    selectedThumb,
    viewShotRef,
    isLoading: useThrottledState(isLoading),
  };
};

export type HookedProps = Props & ReturnType<typeof usePhrases>;
export default usePhrases;
