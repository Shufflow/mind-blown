export const genIdx = (list: any[]) => (): number =>
  Math.floor(Math.random() * (list.length - 1));
const getAsset = <T>(list: T[]) => (idx: number = genIdx(list)()): T => {
  if (idx >= list.length) {
    return list[genIdx(list)()];
  }

  return list[idx];
};

export default getAsset;
