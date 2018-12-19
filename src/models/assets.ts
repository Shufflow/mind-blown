import colors, { Color } from 'src/assets/colorPairs';
import fonts from 'src/assets/fonts';

import getAsset from 'src/utils/assetGetter';

export const getColor: ((idx?: number) => Color) = getAsset(colors);
export const getFont: ((idx?: number) => string) = getAsset(fonts);
