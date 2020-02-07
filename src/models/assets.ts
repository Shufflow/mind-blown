import { useState, useCallback } from 'react';
import lodash from 'lodash';

import colors, { Color } from 'src/assets/colorPairs';

export const getColor: () => Color = () => lodash.sample(colors)!;

export const useColors = () => {
  const genColors = () => {
    const isDark = !!Math.round(Math.random());
    const { light, dark } = getColor();

    return {
      isDark,
      bgColor: isDark ? dark : light,
      fgColor: isDark ? light : dark,
    };
  };

  const [curColors, setColors] = useState(genColors);
  const getNewColors = useCallback(() => {
    setColors(genColors());
  }, []);

  return { colors: curColors, getNewColors };
};
