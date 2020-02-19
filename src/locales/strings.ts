import RouteName from '@routes';

export enum Global {
  cancel = 'cancel',
  done = 'done',
  send = 'send',
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

export enum ModeratePhrases {
  dateAdded = 'dateAdded',
  discard = 'discard',
  emptyList = 'emptyList',
  score = 'score',
  save = 'save',
}

export enum DevMenu {
  moderateSuggestions = 'moderateSuggestions',
  reviewPhrases = 'reviewPhrases',
  showAds = 'showAds',
  logout = 'logout',
  forceCrash = 'forceCrash',
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

export enum EnablePushAlert {
  title = 'title',
  message = 'message',
  later = 'later',
  cancel = 'cancel',
  ok = 'ok',
}

type Key =
  | Global
  | Settings
  | ModeratePhrases
  | DevMenu
  | AdDiscountAlert
  | Home
  | RouteName
  | AdFreeErrorAlert
  | About
  | EnablePushAlert
  | 'name';

export type Strings = { [key in Key]: string };
