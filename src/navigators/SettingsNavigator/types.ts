import {
  NavigationParams,
  NavigationScreenProp,
  NavigationRoute,
} from 'react-navigation';

import { Color } from 'src/assets/colorPairs';

export interface ColoredScreenProps<Params = NavigationParams> {
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params> & {
    color: Color;
  };
}
