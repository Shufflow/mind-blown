import AsyncStorage from '@react-native-community/async-storage';

const Constants = {
  usedPhrasesIdsKey: 'com.shufflow.MindBlown.usedPhrasesIds',
  visitedPhrasesIdsKey: 'com.shufflow.MindBlown.visitedPhrasesIds',
};

class Persist {
  private visitedPhraseIds: Promise<Set<string>>;
  private usedPhraseIds: Promise<Set<string>>;

  constructor() {
    this.visitedPhraseIds = this.loadPhraseCollection(
      Constants.visitedPhrasesIdsKey,
    );
    this.usedPhraseIds = this.loadPhraseCollection(Constants.usedPhrasesIdsKey);
  }

  getVisitedPhrases = async (): Promise<Set<string>> => this.visitedPhraseIds;

  getUsedPhrases = async (): Promise<Set<string>> => this.usedPhraseIds;

  clearUsedPhrases = async (): Promise<void> => {
    await AsyncStorage.setItem(Constants.usedPhrasesIdsKey, JSON.stringify([]));
  };

  visitPhrase = async (id: string): Promise<void> => {
    const list = await this.visitedPhraseIds;
    list.add(id);

    await AsyncStorage.setItem(
      Constants.visitedPhrasesIdsKey,
      JSON.stringify(Array.from(list)),
    );
  };

  usePhrase = async (id: string): Promise<void> => {
    const list = await this.usedPhraseIds;
    list.add(id);

    await AsyncStorage.setItem(
      Constants.usedPhrasesIdsKey,
      JSON.stringify(Array.from(list)),
    );
  };

  private loadPhraseCollection = async (key: string): Promise<Set<string>> => {
    const visitedPhrases = await AsyncStorage.getItem(key);
    return new Set(visitedPhrases ? JSON.parse(visitedPhrases) : []);
  };
}

export default Persist;
