import { Global, Settings, Reddit, DevMenu } from './strings';

export default {
  name: 'English',

  [Global.cancel]: 'Cancel',
  [Global.done]: 'Done',

  [Settings.language]: 'Language',
  [Settings.devMenu]: 'Dev Menu',
  [Settings.sendSuggestion]: 'Send Suggestion',
  [Settings.licenses]: 'Licenses',

  [Reddit.discard]: 'Discard',
  [Reddit.emptyList]: 'No more phrases to review 🎉',
  [Reddit.save]: 'Save',
  [Reddit.score]: 'Score - {{score}}',

  [DevMenu.reviewRedditPhrases]: 'Review Reddit Phrases',
  [DevMenu.showAds]: 'Show Ads',
  [DevMenu.logout]: 'Logout',
};
