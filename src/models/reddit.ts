import { firestore } from 'firebase';
import 'firebase/firestore';

export interface Phrase {
  id: string;
  content: string;
  score: number;
}

class RedditDataSource {
  reddit: firestore.CollectionReference;
  phrases: firestore.CollectionReference;

  constructor() {
    const fs = firestore();
    this.reddit = fs.collection('reddit');
    this.phrases = fs.collection('phrases');
  }

  async loadPhrase(): Promise<Phrase | null> {
    const {
      docs: [ref],
    } = await this.reddit
      .where('discarded', '==', false)
      .orderBy('score', 'desc')
      .limit(1)
      .get();

    if (!ref) {
      return null;
    }

    const { content, score } = ref.data();

    return {
      content,
      score,
      id: ref.id,
    };
  }

  async savePhrase(
    id: string,
    translations: { [locale: string]: string },
  ): Promise<void> {
    const doc = this.reddit.doc(id);
    const { content } = (await doc.get()).data() as any;

    await this.phrases.doc(id).set({
      date: new Date(),
      en: content,
      ...translations,
    });

    await doc.delete();
  }

  async discardPhrase(id: string): Promise<void> {
    await this.reddit.doc(id).update({
      discarded: true,
    });
  }
}

export default RedditDataSource;
