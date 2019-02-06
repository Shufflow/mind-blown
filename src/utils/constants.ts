import { Platform } from 'react-native';

export const Constants = {
  agnesURL: 'https://www.linkedin.com/in/agnespinhanelli/',
  licensesURL:
    'https://raw.githubusercontent.com/Shufflow/mind-blown/master/compiled_licenses.txt',
  repoURL: 'https://github.com/Shufflow/mind-blown',
  storeReview: Platform.select({
    android: 'market://details?id=com.shufflow.MindBlown',
    ios: 'itms-apps://itunes.apple.com/app/1450868764',
  }),
};

export default Constants;
