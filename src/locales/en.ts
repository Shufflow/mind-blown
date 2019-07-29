import RouteName from '@routes';

import {
  Global,
  Settings,
  ModeratePhrases,
  DevMenu,
  AdDiscountAlert,
  Home,
  Strings,
  AdFreeErrorAlert,
  About,
} from './strings';

const strings: Strings = {
  name: 'English',
  [RouteName.Home]: 'Home',
  [RouteName.Settings]: 'Settings',
  [RouteName.ModeratePhrases]: 'Moderate Phrases',
  [RouteName.SendSuggestion]: 'Send Suggestion',
  [RouteName.DevMenu]: 'Dev Menu',
  [RouteName.Licenses]: 'Licenses',
  [RouteName.About]: 'About',

  [Home.errorMessage]: 'An error occurred',
  [Home.tryAgainButton]: 'Try Again',

  [Global.cancel]: 'Cancel',
  [Global.done]: 'Done',

  [Settings.language]: 'Language',
  [Settings.devMenu]: 'Dev Menu',
  [Settings.sendSuggestion]: 'Send Suggestion',
  [Settings.removeAds]: 'Remove Ads',
  [Settings.removeAdsDiscount]: 'Remove Ads - 50% OFF',
  [Settings.about]: 'About',
  [Settings.isAdFreeButton]: 'Remove Ads (Purchased)',

  [ModeratePhrases.dateAdded]: 'Date - {{date}}',
  [ModeratePhrases.discard]: 'Discard',
  [ModeratePhrases.emptyList]: 'No more phrases to review 🎉',
  [ModeratePhrases.save]: 'Save',
  [ModeratePhrases.score]: 'Score - {{score}}',

  [DevMenu.reviewPhrases]: 'Review Phrases',
  [DevMenu.showAds]: 'Show Ads',
  [DevMenu.logout]: 'Logout',

  [AdDiscountAlert.title]: 'Get 50% OFF',
  [AdDiscountAlert.message]:
    "Don't want to pay full price? Watch a video and get 50% OFF the price!",
  [AdDiscountAlert.cancel]: 'No Thanks',
  [AdDiscountAlert.confirm]: 'I want it!',

  [AdFreeErrorAlert.title]: 'Purchase Failed',
  [AdFreeErrorAlert.message]:
    "Your purchase wasn't completed due to an unexpected error. Please, try again.",

  [About.licenses]: 'Licenses',
  [About.madeBy]: 'Made with ❤️ by Flavio Caetano',
  [About.artBy]: 'Art by Agnes Pinhanelli',
  [About.version]: 'Version',
  [About.storeReview]: 'Rate us',
};

export default strings;
