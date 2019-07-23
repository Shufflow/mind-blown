import { firestore } from 'firebase';
import 'firebase/firestore';

import { Locales } from '@locales';

import AdIds, { InterstitialAd } from './ads';
import IAP from './iap';

export interface Phrase {
  id: string;
  [locale: string]: string;
}

interface PhraseMap {
  [id: string]: Phrase;
}

class PhrasesDataSource {
  firestore: firebase.firestore.Firestore;
  phrases: Promise<PhraseMap>;
  usedPhrasesIds: string[];

  constructor() {
    this.firestore = firestore();

    this.usedPhrasesIds = [];
    this.phrases = this.loadAllPhrases();

    InterstitialAd.setAdUnitId(AdIds.phrasesInterstitial);
    InterstitialAd.requestAdIfNeeded();
  }

  async loadAllPhrases(): Promise<PhraseMap> {
    const { docs } = await this.firestore.collection('phrases').get();
    return docs.reduce(
      (res: PhraseMap, doc): PhraseMap => ({
        ...res,
        [doc.id || '']: {
          ...this.processPhrase(doc.data()),
          id: doc.id || '',
        },
      }),
      {} as PhraseMap,
    );
  }

  async getRandomPhrase(): Promise<Phrase | null> {
    const phrases = await this.phrases;

    const isAdFree = await IAP.isAdFree;
    if (this.usedPhrasesIds.length % 3 === 2 && !isAdFree && !__DEV__) {
      InterstitialAd.showAd().then(InterstitialAd.requestAdIfNeeded);
    }

    const len = Object.keys(phrases).length;
    if (len === 0) {
      return null;
    }

    if (len === this.usedPhrasesIds.length) {
      this.usedPhrasesIds = [];
    }

    const availablePhraseIds = Object.keys(phrases).filter(
      id => !this.usedPhrasesIds.includes(id),
    );

    const randIdx = Math.floor(Math.random() * (availablePhraseIds.length - 1));
    const content = phrases[availablePhraseIds[randIdx]];
    this.usedPhrasesIds.push(content.id);
    return content;
  }

  async reviewPhrase(
    id: string,
    positive: boolean,
  ): Promise<firebase.firestore.DocumentReference> {
    return this.firestore.collection('reviews').add({
      positive,
      phrase: this.firestore.collection('phrases').doc(id),
    });
  }

  async sendSuggestion(content: string): Promise<void> {
    this.firestore.collection('suggestion').add({
      content,
    });
  }

  processPhrase(data: firestore.DocumentData): firestore.DocumentData {
    for (const locale of Object.keys(Locales)) {
      data[locale] = data[locale] && data[locale].replace('\\n', '\n');
    }

    return data;
  }
}

export default PhrasesDataSource;
