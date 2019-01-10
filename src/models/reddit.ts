import { firestore } from 'react-native-firebase';
import { CollectionReference } from 'react-native-firebase/firestore';

export interface RedditPhrase {
  id: string;
  content: string;
  score: number;
}

class RedditDataSource {
  reddit: CollectionReference;
  phrases: CollectionReference;

  constructor() {
    const fs = firestore();
    this.reddit = fs.collection('reddit');
    this.phrases = fs.collection('phrases');
  }

  async loadPhrase(): Promise<RedditPhrase | null> {
    const {
      docs: [ref],
    } = await this.reddit
      .orderBy('score', 'desc')
      .limit(1)
      .get();

    if (!ref) {
      return null;
    }

    const { content, score } = ref.data() as any;

    return {
      content,
      score,
      id: ref.id as string,
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
    await this.reddit.doc(id).delete();
  }
}

export default RedditDataSource;
