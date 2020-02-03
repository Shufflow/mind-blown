import { firestore } from 'firebase';
import { knuthShuffle } from 'knuth-shuffle';
import 'firebase/firestore';

import { Locales } from '@locales';

import AdIds, { InterstitialAd } from './ads';
import Persist from './persist';

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
  shuffledPhraseIds: Promise<string[]>;

  persist = new Persist();
  adManager = new InterstitialAd(AdIds.phrasesInterstitial);

  constructor() {
    this.firestore = firestore();

    this.phrases = this.loadAllPhrases();
    this.shuffledPhraseIds = this.shufflePhraseIds();
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

  shufflePhraseIds = async (): Promise<string[]> => {
    const [phrases, usedPhrasesIds] = await Promise.all([
      this.phrases,
      this.persist.getUsedPhrases(),
    ]);
    const len = Object.keys(phrases).length;
    if (len === 0) {
      return [];
    }

    if (len === usedPhrasesIds.size) {
      usedPhrasesIds.clear();
    }

    const availablePhraseIds = Object.keys(phrases).filter(
      id => !usedPhrasesIds.has(id),
    );

    const visitedPhrasesIds = await this.persist.getVisitedPhrases();
    const unseenPhrasesIds = knuthShuffle(
      availablePhraseIds.filter(id => !visitedPhrasesIds.has(id)),
    );
    const seenPhrasesIds = knuthShuffle(
      availablePhraseIds.filter(id => visitedPhrasesIds.has(id)),
    );

    return unseenPhrasesIds.concat(seenPhrasesIds);
  };

  async getRandomPhrase(): Promise<Phrase | null> {
    const nextPhrase = await this.getNextPhrase();

    /**
     * TODO
     * Interstitial ads have been temporarily removed while IAP is not working
     */
    // const [nextPhrase, usedPhrasesIds] = await Promise.all<
    //   Phrase | null,
    //   Set<string>
    // >([this.getNextPhrase(), this.persist.getUsedPhrases()]);

    if (nextPhrase) {
      // const isAdFree = await IAP.isAdFree;
      //
      // if (usedPhrasesIds.size % 3 === 2 && !isAdFree && !__DEV__) {
      //   this.adManager
      //     .showAd()
      //     .then(
      //       () =>
      //         (this.adManager = new InterstitialAd(AdIds.phrasesInterstitial)),
      //     );
      // }

      await this.persist.usePhrase(nextPhrase.id);
    }

    return nextPhrase;
  }

  async reviewPhrase(
    id: string,
    positive: boolean,
  ): Promise<firebase.firestore.DocumentReference> {
    return this.firestore.collection('reviews').add({
      positive,
      date: new Date(),
      phrase: this.firestore.collection('phrases').doc(id),
    });
  }

  async sendSuggestion(content: string): Promise<string> {
    const { id } = await this.firestore.collection('suggestion').add({
      content,
      date: new Date(),
      discarded: false,
    });
    return id;
  }

  processPhrase(data: firestore.DocumentData): firestore.DocumentData {
    for (const locale of Object.keys(Locales)) {
      data[locale] = data[locale] && data[locale].replace('\\n', '\n');
    }

    return data;
  }

  private getNextPhrase = async (): Promise<Phrase | null> => {
    // tslint:disable-next-line prefer-const
    let [phrases, phraseIds] = await Promise.all([
      this.phrases,
      this.shuffledPhraseIds,
    ]);

    if (!phraseIds.length) {
      phraseIds = await this.shufflePhraseIds();
    }

    const len = Object.keys(phrases).length;
    if (len === 0 || phraseIds.length === 0) {
      return null;
    }

    return phrases[phraseIds.shift()!];
  };
}

export default PhrasesDataSource;
