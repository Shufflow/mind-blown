let memoizeCache: any = {};

export const wipeMemoizeCache = () => {
  memoizeCache = {};
};

const memoize = <TArgs extends any[], TRet>(
  method: (...args: TArgs) => Promise<TRet>,
) => async (...args: TArgs): Promise<TRet> => {
  const json = JSON.stringify(args);
  memoizeCache[json] = memoizeCache[json] || method.apply(undefined, args);
  return memoizeCache[json];
};

export default memoize;
