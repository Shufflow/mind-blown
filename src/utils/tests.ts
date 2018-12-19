export const stubFirebase = (fixtureData: Object) => {
  const collection = Object.entries(fixtureData).reduce(
    (res: Object, [key, value]: [string, any]): any => ({
      ...res,
      [key]: {
        __doc__: value.reduce(
          (r: Object, v: any, i: number): any => ({
            ...r,
            [i.toString()]: v,
          }),
          {},
        ),
      },
    }),
    {},
  );

  return { __collection__: collection };
};
