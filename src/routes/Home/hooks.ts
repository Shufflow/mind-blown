import { useState, useCallback, useRef } from 'react';
import { useLazyRef, useWorkerState } from 'react-hook-utilities';
import { NavigationInjectedProps } from 'react-navigation';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import RouteName from '@routes';
import { LocaleConsumerProps } from '@hocs/withLocale';

import PhrasesDataSource from 'src/models/phrases';
import Analytics from 'src/models/analytics';
import { useColors } from 'src/models/assets';
import { useFonts } from 'src/models/fonts';

export enum SelectedThumb {
  Up = 'up',
  Down = 'down',
}

type Props = LocaleConsumerProps & NavigationInjectedProps;

const usePhrases = ({ locale, navigation }: Props) => {
  const { getNewColors, ...colors } = useColors();
  const { getNextFont, ...fonts } = useFonts();
  const viewShotRef = useRef<ViewShot>(null);
  const [selectedThumb, setThumb] = useState<SelectedThumb | null>(null);
  const model = useLazyRef(() => new PhrasesDataSource()).current;
  const {
    isLoading,
    callback: getRandomPhrase,
    data: phrase,
    error,
  } = useWorkerState(async () => {
    const result = await model.getRandomPhrase(locale);

    getNewColors();
    getNextFont(result?.content ?? '');
    setThumb(null);
    result && Analytics.viewPhrase(result.id);

    return result;
  }, [locale, getNextFont]);

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
    phrase,
    selectedThumb,
    viewShotRef,
  };
};

export type HookedProps = Props & ReturnType<typeof usePhrases>;
export default usePhrases;
