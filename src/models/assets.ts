import colors, { Color } from 'src/assets/colorPairs';

import getAsset from '@utils/assetGetter';

export const getColor: (idx?: number) => Color = getAsset(colors);
