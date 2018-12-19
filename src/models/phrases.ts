import { firestore, RNFirebase } from 'react-native-firebase';
import { DocumentSnapshot } from 'react-native-firebase/firestore';

export interface Phrase {
  [locale: string]: string;
}

class PhrasesDataSource {
  firestore: RNFirebase.firestore.Firestore;
  phrases: Phrase[];

  loadPromise: Promise<Phrase[]>;

  constructor() {
    this.firestore = firestore();
    this.phrases = [];

    this.loadPromise = this.loadAllPhrases();
    this.loadPromise.then(phrases => {
      this.phrases = phrases;
    });
  }

  async loadAllPhrases(): Promise<Phrase[]> {
    const { docs } = await this.firestore.collection('phrases').get();
    const data = docs.map((s: DocumentSnapshot): Phrase => s.data() as Phrase);
    return data;
  }

  async getRandomPhrase(locale: string): Promise<string | null> {
    await this.loadPromise;

    const len = this.phrases.length;
    if (len === 0) {
      return null;
    }

    const randIdx = Math.floor(Math.random() * len);
    return this.phrases[randIdx][locale];
  }
}

export default PhrasesDataSource;
