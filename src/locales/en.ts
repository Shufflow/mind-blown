import { Global, Settings, Reddit, DevMenu, AdDiscountAlert } from './strings';

export default {
  name: 'English',

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
