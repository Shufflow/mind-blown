declare module '@typed/compose';
declare module 'react-native-admob';
interface ServiceWorkerRegistration {}
declare module 'react-native-text-size';

declare module 'base-64' {
  const decode: (input: string) => string;
  const encode: (input: string) => string;
}

declare module 'knuth-shuffle' {
  const knuthShuffle: <T>(array: Array<T>) => Array<T>;
}
