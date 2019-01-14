import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';

/// POG: sending `navigation.goBack` to `onPress` doesn't work
export const goBack = ({ navigation }: ColoredScreenProps) => () =>
  navigation.goBack();
