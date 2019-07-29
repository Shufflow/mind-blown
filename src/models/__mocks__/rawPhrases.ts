export const mockPhrases: Record<string, any> = {
  bar: {
    content: 'bar',
    dateAdded: undefined,
    discarded: false,
    id: 'bar',
    score: 1,
  },
  foo: {
    content: 'foo',
    dateAdded: undefined,
    discarded: false,
    id: 'foo',
    score: 0,
  },
  xpto: {
    content: 'xpto',
    dateAdded: undefined,
    discarded: false,
    id: 'xpto',
    score: 2,
  },
  yolo: {
    content: 'yolo',
    dateAdded: undefined,
    discarded: true,
    id: 'yolo',
    score: 3,
  },
};

export const mockPhraseWithDate: Record<string, any> = {
  bar: {
    content: 'bar',
    dateAdded: { toDate: () => new Date(2019, 6, 28) },
    discarded: false,
    id: 'bar',
    score: 1,
  },
};
