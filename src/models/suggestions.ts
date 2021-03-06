import { firestore } from 'firebase';

import { Translation } from 'src/models/types';

export interface Suggestion {
  id: string;
  content: string;
  date: Date;
}

export const getSuggestion = async (): Promise<Suggestion | null> => {
  const {
    docs: [ref],
  } = await firestore()
    .collection('suggestion')
    .where('discarded', '==', false)
    .orderBy('date')
    .limit(1)
    .get();

  const data = ref.data();

  return {
    ...data,
    date: data.date?.toDate() || null,
    id: ref.id,
  } as Suggestion | null;
};

export const discardSuggestion = async (id: string): Promise<void> =>
  firestore()
    .collection('suggestion')
    .doc(id)
    .update({ discarded: true });

export const saveSuggestion = async (
  id: string,
  translations: Translation[],
): Promise<void> => {
  const doc = firestore()
    .collection('suggestion')
    .doc(id);

  await firestore()
    .collection('phrases')
    .doc(id)
    .set({
      ...Object.fromEntries(
        translations.map(({ language, content }) => [language, content]),
      ),
      date: new Date(),
      usedAsPOtD: false,
    });

  await doc.delete();
};
