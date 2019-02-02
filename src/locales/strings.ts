import RouteName from 'src/routes';

export enum Global {
  cancel = 'cancel',
  done = 'done',
}
export enum Settings {
  devMenu = 'devMenu',
  language = 'language',
  sendSuggestion = 'sendSuggestion',
  licenses = 'licenses',
  madeBy = 'madeBy',
  artBy = 'artBy',
  removeAds = 'removeAds',
  removeAdsDiscount = 'removeAdsDiscount',
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

type Key =
  | Global
  | Settings
  | Reddit
  | DevMenu
  | AdDiscountAlert
  | Home
  | RouteName
  | AdFreeErrorAlert
  | 'name';

export type Strings = { [key in Key]: string };
