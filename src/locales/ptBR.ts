import { Global, Settings, Reddit, DevMenu, AdDiscountAlert } from './strings';

export default {
  name: 'Português',

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
};
