import analytics from '@react-native-firebase/analytics';

import RouteName from '@routes';

const Analytics = {
  appRating: async () => analytics().logEvent('app_rating'),
  currentScreen: async (route: RouteName) =>
    analytics().setCurrentScreen(route),
  reviewPhrase: async (id: string, review: boolean) =>
    analytics().logEvent('review_phrase', {
      id,
      review,
    }),
  selectAuthor: async () => analytics().logEvent('select_author'),
  selectDesigner: async () => analytics().logEvent('select_designer'),
  selectLanguage: async (lang: string) =>
    analytics().logEvent('select_lang', { lang }),
  sentSuggestion: async (id: string) =>
    analytics().logEvent('sent_suggestion', { id }),
  sharePhrase: async (id: string, medium?: string) =>
    analytics().logEvent('share_phrase', { id, medium }),
  viewPhrase: async (id: string) => analytics().logEvent('view_phrase', { id }),
};

export default Analytics;
