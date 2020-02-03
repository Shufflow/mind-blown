import { useRef, useCallback, useState, useEffect } from 'react';

import RawPhrasesDataSource, { Phrase } from 'src/models/rawPhrases';
import { Translation } from 'src/models/types';

const emptyTranslation = { language: 'pt-BR', content: '' };

const useModeratePhrases = () => {
  const dataSource = useRef(new RawPhrasesDataSource()).current;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [translations, setTranslations] = useState<Translation[]>([
    emptyTranslation,
  ]);

  const loadPhrase = async () => {
    setLoading(true);

    try {
      setPhrase(await dataSource.loadPhrase());
      setTranslations([emptyTranslation]);
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.warn(e);
    }

    setLoading(false);
  };

  // Did Mount
  useEffect(() => {
    loadPhrase();
  }, [dataSource]);

  /// HANDLERS

  const handlePressSave = useCallback(async () => {
    if (!phrase) {
      return;
    }

    setLoading(true);

    await dataSource.savePhrase(
      phrase.id,
      translations.reduce(
        (res, { language, content }) => ({
          ...res,
          [language]: content,
        }),
        {} as { [locale: string]: string },
      ),
    );

    await loadPhrase();
  }, [phrase]);

  const handlePressDiscard = useCallback(async () => {
    if (!phrase) {
      return;
    }

    setLoading(true);
    await dataSource.discardPhrase(phrase.id);
    await loadPhrase();
  }, [phrase, dataSource]);

  const handlePressAddTranslation = useCallback(() => {
    setTranslations([...translations, emptyTranslation]);
  }, [translations]);

  const handleRemoveTranslation = useCallback(
    (idx: number) => {
      setTranslations(translations.filter((_, i) => idx !== i));
    },
    [translations],
  );

  const handleTranslate = useCallback(
    (idx: number, language: string, content: string) => {
      translations[idx] = { language, content };
      setTranslations(translations);
    },
    [translations],
  );

  return {
    handlePressAddTranslation,
    handlePressDiscard,
    handlePressSave,
    handleRemoveTranslation,
    handleTranslate,
    isLoading,
    phrase,
    translations,
  };
};

export default useModeratePhrases;
