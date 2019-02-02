import routeNames from 'src/routes';

import {
  Global,
  Settings,
  Reddit,
  DevMenu,
  AdDiscountAlert,
  Home,
} from './strings';

export default {
  name: 'English',
  [routeNames.Settings]: 'Settings',
  [routeNames.RedditPhrases]: 'Reddit Phrases',
  [routeNames.SendSuggestion]: 'Send Suggestion',
  [routeNames.DevMenu]: 'Dev Menu',
  [routeNames.Licenses]: 'Licenses',

  [Home.errorMessage]: 'An error occurred',
  [Home.tryAgainButton]: 'Try Again',

  [Global.cancel]: 'Cancel',
  [Global.done]: 'Done',

  [Settings.language]: 'Language',
  [Settings.devMenu]: 'Dev Menu',
  [Settings.sendSuggestion]: 'Send Suggestion',
  [Settings.licenses]: 'Licenses',
  [Settings.madeBy]: 'Made with ❤️ by Flavio Caetano',
  [Settings.artBy]: 'Art by Agnes Pinhanelli',
  [Settings.removeAds]: 'Remove Ads',
  [Settings.removeAdsDiscount]: 'Remove Ads - 50% OFF',

  [Reddit.discard]: 'Discard',
  [Reddit.emptyList]: 'No more phrases to review 🎉',
  [Reddit.save]: 'Save',
  [Reddit.score]: 'Score - {{score}}',

  [DevMenu.reviewRedditPhrases]: 'Review Reddit Phrases',
  [DevMenu.showAds]: 'Show Ads',
  [DevMenu.logout]: 'Logout',

  [AdDiscountAlert.title]: 'Get 50% OFF',
  [AdDiscountAlert.message]:
    "Don't want to pay full price? Watch a video and get 50% OFF the price!",
  [AdDiscountAlert.cancel]: 'No Thanks',
  [AdDiscountAlert.confirm]: 'I want it!',
};
