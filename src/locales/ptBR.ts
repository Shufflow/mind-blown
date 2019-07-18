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
  name: 'Português',
  [RouteName.Home]: 'Home',
  [RouteName.Settings]: 'Configurações',
  [RouteName.ModeratePhrases]: 'Moderar Frases',
  [RouteName.SendSuggestion]: 'Enviar Sugestão',
  [RouteName.DevMenu]: 'Dev Menu',
  [RouteName.Licenses]: 'Licenças',
  [RouteName.About]: 'Sobre',

  [Home.errorMessage]: 'Ocorreu um erro',
  [Home.tryAgainButton]: 'Tentar Novamente',

  [Global.cancel]: 'Cancelar',
  [Global.done]: 'OK',

  [Settings.language]: 'Idioma',
  [Settings.devMenu]: 'Dev Menu',
  [Settings.sendSuggestion]: 'Enviar Sugestão',
  [Settings.removeAds]: 'Remover Anúncios',
  [Settings.removeAdsDiscount]: 'Remover Anúncios - 50% Desconto',
  [Settings.about]: 'Sobre',
  [Settings.isAdFreeButton]: 'Remover Anúncios (Comprado)',

  [ModeratePhrases.discard]: 'Descartar',
  [ModeratePhrases.emptyList]: 'Sem frases para revisar 🎉',
  [ModeratePhrases.save]: 'Salvar',
  [ModeratePhrases.score]: 'Pontos - {{score}}',

  [DevMenu.reviewPhrases]: 'Revisar Frases',
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

  [About.licenses]: 'Licenças',
  [About.madeBy]: 'Feito com ❤️ por Flavio Caetano',
  [About.artBy]: 'Arte de Agnes Pinhanelli',
  [About.version]: 'Versão',
  [About.storeReview]: 'Avaliar o app',
};

export default strings;
