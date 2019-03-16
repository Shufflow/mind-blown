import RouteName from '@routes';

export enum Global {
  cancel = 'cancel',
  done = 'done',
}
export enum Settings {
  about = 'about',
  devMenu = 'devMenu',
  language = 'language',
  sendSuggestion = 'sendSuggestion',
  removeAds = 'removeAds',
  removeAdsDiscount = 'removeAdsDiscount',
  isAdFreeButton = 'isAdFreeButton',
}

export enum Reddit {
  discard = 'discard',
  emptyList = 'emptyList',
  score = 'score',
  save = 'save',
}

export enum DevMenu {
  reviewRedditPhrases = 'reviewRedditPhrases',
  showAds = 'showAds',
  logout = 'logout',
}

export enum AdDiscountAlert {
  title = 'discountAlertTitle',
  message = 'dicountAlertMessage',
  cancel = 'discountAlertCancel',
  confirm = 'discountAlertConfirm',
}

export enum Home {
  errorMessage = 'errorMessage',
  tryAgainButton = 'tryAgainButton',
}

export enum AdFreeErrorAlert {
  title = 'adFreeErrorAlertTitle',
  message = 'adFreeErrorAlertMessage',
}

export enum About {
  licenses = 'licenses',
  version = 'version',
  madeBy = 'madeBy',
  artBy = 'artBy',
  storeReview = 'storeReview',
}

type Key =
  | Global
  | Settings
  | Reddit
  | DevMenu
  | AdDiscountAlert
  | Home
  | RouteName
  | AdFreeErrorAlert
  | About
  | 'name';

export type Strings = { [key in Key]: string };
