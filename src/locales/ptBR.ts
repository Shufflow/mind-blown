import RouteName from '@routes';

import {
  Global,
  Settings,
  Reddit,
  DevMenu,
  AdDiscountAlert,
  Home,
  Strings,
  AdFreeErrorAlert,
} from './strings';

const strings: Strings = {
  name: 'Português',
  [RouteName.Home]: 'Home',
  [RouteName.Settings]: 'Configurações',
  [RouteName.RedditPhrases]: 'Frases do Reddit',
  [RouteName.SendSuggestion]: 'Enviar Sugestão',
  [RouteName.DevMenu]: 'Dev Menu',
  [RouteName.Licenses]: 'Licenças',

  [Home.errorMessage]: 'Ocorreu um erro',
  [Home.tryAgainButton]: 'Tentar Novamente',

  [Global.cancel]: 'Cancelar',
  [Global.done]: 'OK',

  [Settings.language]: 'Idioma',
  [Settings.devMenu]: 'Dev Menu',
  [Settings.sendSuggestion]: 'Enviar Sugestão',
  [Settings.licenses]: 'Licenças',
  [Settings.madeBy]: 'Feito com ❤️ por Flavio Caetano',
  [Settings.artBy]: 'Arte de Agnes Pinhanelli',
  [Settings.removeAds]: 'Remover Anúncios',
  [Settings.removeAdsDiscount]: 'Remover Anúncios - 50% Desconto',

  [Reddit.discard]: 'Descartar',
  [Reddit.emptyList]: 'Sem frases para revisar 🎉',
  [Reddit.save]: 'Salvar',
  [Reddit.score]: 'Pontos - {{score}}',

  [DevMenu.reviewRedditPhrases]: 'Revisar Frases do Reddit',
  [DevMenu.showAds]: 'Mostrar Ads',
  [DevMenu.logout]: 'Logout',

  [AdDiscountAlert.title]: '50% de Desconto',
  [AdDiscountAlert.message]:
    'Não quer pagar o preço inteiro? Veja este vídeo e receba 50% de desconto!',
  [AdDiscountAlert.cancel]: 'Não, obrigado',
  [AdDiscountAlert.confirm]: 'Eu quero!',

  [AdFreeErrorAlert.title]: 'Erro na Compra',
  [AdFreeErrorAlert.message]:
    'Sua compra não foi completada em função de um erro inesperado. Por favor, tente novamente.',
};

export default strings;
