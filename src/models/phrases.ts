import { firestore, RNFirebase } from 'react-native-firebase';
import {
  DocumentReference,
  DocumentSnapshot,
} from 'react-native-firebase/firestore';

interface PhraseCollection {
  id: string;
  [locale: string]: string;
}

interface PhraseMap {
  [id: string]: PhraseCollection;
}

export interface Phrase {
  id: string;
  content: string;
}

class PhrasesDataSource {
  firestore: RNFirebase.firestore.Firestore;
  phrases: Promise<PhraseMap>;
  usedPhrasesIds: string[];

  constructor() {
    this.firestore = firestore();
    this.usedPhrasesIds = [];
    this.phrases = this.loadAllPhrases();
  }

  async loadAllPhrases(): Promise<PhraseMap> {
    const { docs } = await this.firestore.collection('phrases').get();
    return docs.reduce(
      (res: PhraseMap, doc: DocumentSnapshot): PhraseMap => ({
        ...res,
        [doc.id || '']: {
          ...doc.data(),
          id: doc.id || '',
        },
      }),
      {} as PhraseMap,
    );
  }

  async getRandomPhrase(locale: string): Promise<Phrase | null> {
    const phrases = await this.phrases;

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
    return {
      content: content[locale] || content.en,
      id: content.id,
    };
  }

  async reviewPhrase(
    id: string,
    positive: boolean,
  ): Promise<DocumentReference> {
    return this.firestore.collection('reviews').add({
      positive,
      phrase: this.firestore.collection('phrases').doc(id),
    });
  }
}

export default PhrasesDataSource;
