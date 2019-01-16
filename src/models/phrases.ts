import { firestore } from 'firebase';
import 'firebase/firestore';

import AdIds, { InterstitialAd } from './ads';

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
    this.firestore.settings({
      timestampsInSnapshots: true,
    });

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
          ...doc.data(),
          id: doc.id || '',
        },
      }),
      {} as PhraseMap,
    );
  }

  async getRandomPhrase(): Promise<Phrase | null> {
    const phrases = await this.phrases;

    if (this.usedPhrasesIds.length % 3 === 2 && !__DEV__) {
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
}

export default PhrasesDataSource;
