import { useState, useCallback } from 'react';
import { useWorker, useDidMount } from 'react-hook-utilities';

import {
  getSuggestion,
  discardSuggestion,
  saveSuggestion,
  Suggestion,
} from 'src/models/suggestions';
import { Translation } from 'src/models/types';
import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';

const useModerateSuggestions = () => {
  const [phrase, setPhrase] = useState<Suggestion | null>(null);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const {
    isLoading: isLoadingSuggestion,
    callback: fetchNextSuggestion,
  } = useWorker(async () => {
    const suggestion = await getSuggestion();
    setPhrase(suggestion);
    setTranslations([{ language: 'en', content: suggestion?.content ?? '' }]);
  }, [phrase]);

  useDidMount(fetchNextSuggestion);

  const handlePressAddTranslation = useCallback(() => {
    setTranslations([
      ...translations,
      { language: 'pt-BR', content: phrase?.content ?? '' },
    ]);
  }, [translations, phrase]);

  const handleTranslate = useCallback(
    (idx: number, language: string, content: string) => {
      translations[idx] = { language, content };
      setTranslations(translations);
    },
    [],
  );

  const handleRemoveTranslation = useCallback(
    (idx: number) => {
      setTranslations(translations.filter((_, i) => i !== idx));
    },
    [translations],
  );

  const {
    isLoading: isLoadingDiscard,
    callback: handlePressDiscard,
  } = useWorker(async () => {
    await discardSuggestion(phrase!.id);
    fetchNextSuggestion();
  }, [phrase]);

  const {
    isLoading: isLoadingSave,
    callback: handlePressSave,
  } = useWorker(async () => {
    await saveSuggestion(phrase!.id, translations);
    fetchNextSuggestion();
  }, [phrase, translations]);

  return {
    handlePressAddTranslation,
    handlePressDiscard,
    handlePressSave,
    handleRemoveTranslation,
    handleTranslate,
    phrase,
    translations,
    isLoading: isLoadingSuggestion || isLoadingDiscard || isLoadingSave,
  };
};

export type Props = ReturnType<typeof useModerateSuggestions> &
  ColoredScreenProps;
export default useModerateSuggestions;
