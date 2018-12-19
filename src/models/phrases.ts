import { firestore, RNFirebase } from 'react-native-firebase';
import { DocumentSnapshot } from 'react-native-firebase/firestore';

export interface Phrase {
  [locale: string]: string;
}

class PhrasesDataSource {
  firestore: RNFirebase.firestore.Firestore;
  phrases: Promise<Phrase[]>;

  constructor() {
    this.firestore = firestore();
    this.phrases = this.loadAllPhrases();
  }

  async loadAllPhrases(): Promise<Phrase[]> {
    const { docs } = await this.firestore.collection('phrases').get();
    const data = docs.map((s: DocumentSnapshot): Phrase => s.data() as Phrase);
    return data;
  }

  async getRandomPhrase(locale: string): Promise<string | null> {
    const phrases = await this.phrases;

    const len = phrases.length;
    if (len === 0) {
      return null;
    }

    const randIdx = Math.floor(Math.random() * (len - 1));
    const content = phrases[randIdx];
    return content[locale] || content.en;
  }
}

export default PhrasesDataSource;
