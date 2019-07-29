import { firestore } from 'firebase';
import { decode } from 'base-64';
import 'firebase/firestore';

export interface Phrase {
  id: string;
  content: string;
  score: number;
  dateAdded?: Date;
}

class RawPhrasesDataSource {
  rawPhrases: firestore.CollectionReference;
  phrases: firestore.CollectionReference;

  constructor() {
    const fs = firestore();
    this.rawPhrases = fs.collection(decode('cmVkZGl0'));
    this.phrases = fs.collection('phrases');
  }

  async loadPhrase(): Promise<Phrase | null> {
    const {
      docs: [ref],
    } = await this.rawPhrases
      .where('discarded', '==', false)
      .orderBy('score', 'desc')
      .limit(1)
      .get();

    if (!ref) {
      return null;
    }

    const { content, score, dateAdded } = ref.data();

    return {
      content,
      score,
      dateAdded: dateAdded && dateAdded.toDate(),
      id: ref.id,
    };
  }

  async savePhrase(
    id: string,
    translations: { [locale: string]: string },
  ): Promise<void> {
    const doc = this.rawPhrases.doc(id);
    const { content } = (await doc.get()).data() as any;

    await this.phrases.doc(id).set({
      ...translations,
      date: new Date(),
      en: content,
    });

    await doc.delete();
  }

  async discardPhrase(id: string): Promise<void> {
    await this.rawPhrases.doc(id).update({
      date: new Date(),
      discarded: true,
    });
  }
}

export default RawPhrasesDataSource;
