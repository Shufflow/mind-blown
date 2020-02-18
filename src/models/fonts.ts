import { useCallback } from 'react';
import { useLazyRef, usePromisedState } from 'react-hook-utilities';
import { NativeModules, LayoutChangeEvent } from 'react-native';
import { knuthShuffle } from 'knuth-shuffle';
import lodash from 'lodash';
import RNTextSize from 'react-native-text-size';

import { asyncBinarySearch } from '@utils/search';

interface Size {
  height: number;
  width: number;
}

export interface Font {
  fontFamily: string;
  fontSize: number;
}

const Constants = {
  desiredFontSize: 40,
};

class Fonts {
  private fonts: Promise<string[]>;

  constructor() {
    this.fonts = NativeModules.Fonts.getAvailableFonts().then(knuthShuffle);
  }

  getRandomFont = async (): Promise<string> => {
    const fonts = await this.fonts;
    const result = fonts.shift()!;
    fonts.push(result);
    return result;
  };
}

export const useFonts = () => {
  const [size, setSize] = usePromisedState<Size>();
  const model = useLazyRef<Promise<string[]>>(() =>
    NativeModules.Fonts.getAvailableFonts().then(lodash.shuffle),
  ).current;

  const handlePhraseContainerSize = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setSize(layout);
    },
    [],
  );

  const getNextFont = useCallback(
    async (text: string): Promise<Font> => {
      const fonts = await model;
      const resSize = await size;
      const fontFamily = fonts.shift()!;
      fonts.push(fontFamily);

      // Get font size for text
      const range = lodash.range(Constants.desiredFontSize);
      const fontSize = await asyncBinarySearch(
        range,
        async (elem: number) =>
          RNTextSize.measure({
            fontFamily,
            text,
            fontSize: elem,
            width: resSize.width,
          }).then(({ height }) => height - resSize.height),
        { fontFamily, height: resSize.height },
      );

      return { fontFamily, fontSize };
    },
    [size.value, size, model],
  );

  return { handlePhraseContainerSize, getNextFont };
};

export default Fonts;
