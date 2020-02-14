import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
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
} from '@utils/hooks';

import PhrasesDataSource, { Phrase } from 'src/models/phrases';
import Analytics from 'src/models/analytics';
import { useColors } from 'src/models/assets';
import { useFonts } from 'src/models/fonts';

export enum SelectedThumb {
  Up = 'up',
  Down = 'down',
}

type Props = LocaleConsumerProps &
  NavigationInjectedProps<{ phraseId?: string }>;

const usePhrases = ({ navigation }: Props) => {
  const phraseId = navigation.getParam('phraseId');
  const { locale } = useLocale();
  const { getNewColors, ...colors } = useColors();
  const { getNextFont, ...fonts } = useFonts();
  const viewShotRef = useRef<ViewShot>(null);
  const [selectedThumb, setThumb] = useState<SelectedThumb | null>(null);
  const model = useLazyRef(() => new PhrasesDataSource()).current;
  const abortable = usePromiseAborterRef<Phrase>();
  const {
    isLoading,
    callback: getRandomPhrase,
    data,
    error,
  } = useWorkerState(async () => {
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

    return result;
  }, [phraseId]);

  useEffectUpdate(
    ([oldPhraseId]) => {
      if (!!phraseId && !oldPhraseId) {
        getRandomPhrase();
      }

      if (data?.id === phraseId) {
        navigation.setParams({ phraseId: undefined });
      }
    },
    [phraseId, data?.id, getRandomPhrase],
  );

  const phrase = useMemo(
    () =>
      data && {
        content: data[locale] ?? data.en,
        id: data.id,
      },
    [data, locale],
  );

  useEffect(() => {
    getNewColors();
    getNextFont(phrase?.content ?? '');
  }, [phrase]);

  const handlePressReview = useCallback(
    async (review: boolean) => {
      if (!phrase) {
        return;
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
    [phrase],
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
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }, [phrase]);

  return {
    ...colors,
    ...fonts,
    error,
    getRandomPhrase,
    handlePressReview,
    handlePressSettings,
    handlePressShare,
    isLoading,
    locale,
    phrase,
    selectedThumb,
    viewShotRef,
  };
};

export type HookedProps = Props & ReturnType<typeof usePhrases>;
export default usePhrases;
