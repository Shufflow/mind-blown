const AdIds = {
  homeBottomBanner: 'ca-app-pub-3166606200488630/1078897744',
  homeTopBanner: 'ca-app-pub-3166606200488630/6109423644',
  phrasesInterstitial: 'ca-app-pub-3166606200488630/7403922502',
  sendSuggestionBottomBanner: 'ca-app-pub-3166606200488630/5095617078',
  settingsBottomBanner: 'ca-app-pub-3166606200488630/3695013296',
};

export const onFailToLoadAd = (e: Error) => {
  if (__DEV__) {
    // tslint:disable-next-line: no-console
    console.warn(e);
  }
};

export default AdIds;
