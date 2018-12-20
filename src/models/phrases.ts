import { firestore, RNFirebase } from 'react-native-firebase';
import {
  DocumentReference,
  DocumentSnapshot,
} from 'react-native-firebase/firestore';

interface PhraseCollection {
  id: string;
  [locale: string]: string;
}

export interface Phrase {
  id: string;
  content: string;
}

class PhrasesDataSource {
  firestore: RNFirebase.firestore.Firestore;
  phrases: Promise<PhraseCollection[]>;

  constructor() {
    this.firestore = firestore();
    this.phrases = this.loadAllPhrases();
  }

  async loadAllPhrases(): Promise<PhraseCollection[]> {
    const { docs } = await this.firestore.collection('phrases').get();
    const data = docs.map(
      (doc: DocumentSnapshot): PhraseCollection => ({
        ...doc.data(),
        id: doc.id || '',
      }),
    );
    return data;
  }

  async getRandomPhrase(locale: string): Promise<Phrase | null> {
    const phrases = await this.phrases;

    const len = phrases.length;
    if (len === 0) {
      return null;
    }

    const randIdx = Math.floor(Math.random() * (len - 1));
    const content = phrases[randIdx];
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
