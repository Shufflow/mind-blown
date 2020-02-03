interface ServiceWorkerRegistration {}
declare module 'react-native-text-size';

declare module 'base-64' {
  const decode: (input: string) => string;
  const encode: (input: string) => string;
}

declare module 'knuth-shuffle' {
  const knuthShuffle: <T>(array: Array<T>) => Array<T>;
}

declare type Minus<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
