import colors, { Color } from 'src/assets/colorPairs';

export const genIdx = (): number => Math.floor(Math.random() * colors.length);
const getColor = (idx: number = genIdx()): Color => {
  if (idx >= colors.length) {
    return colors[genIdx()];
  }

  return colors[idx];
};

export default getColor;
