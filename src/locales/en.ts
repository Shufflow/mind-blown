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
  EnablePushAlert,
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
  [RouteName.ModerateSuggestions]: 'Moderate Suggestions',

  [Home.errorMessage]: 'An error occurred',
  [Home.tryAgainButton]: 'Try Again',

  [Global.cancel]: 'Cancel',
  [Global.done]: 'Done',
  [Global.send]: 'Send',

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
  [DevMenu.forceCrash]: 'Force Crash',
  [DevMenu.moderateSuggestions]: 'Moderate Suggestions',

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
  [About.storeReview]: 'Rate the app',

  [EnablePushAlert.title]: 'Are you enjoying the app?',
  [EnablePushAlert.message]:
    'Enable push notifications to receive the phrase of the day!',
  [EnablePushAlert.cancel]: 'No, thanks',
  [EnablePushAlert.later]: 'Maybe later?',
  [EnablePushAlert.ok]: 'YASS!',
};

export default strings;
