import lodash from 'lodash';

import colors, { Color } from 'src/assets/colorPairs';

export interface ColorWithBrightness {
  isDark: boolean;
  bgColor: string;
  fgColor: string;
}

export const getColor: () => Color = () => lodash.sample(colors)!;

export const getNewColors = (): ColorWithBrightness => {
  const isDark = !!Math.round(Math.random());
  const { light, dark } = getColor();

  return {
    isDark,
    bgColor: isDark ? dark : light,
    fgColor: isDark ? light : dark,
  };
};
