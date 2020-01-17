import { NativeModules } from 'react-native';
import { knuthShuffle } from 'knuth-shuffle';

class Fonts {
  private fonts: Promise<string[]>;

  constructor() {
    this.fonts = NativeModules.Fonts.getAvailableFonts().then(knuthShuffle);
  }

  getRandomFont = async (): Promise<string> => {
    const fonts = await this.fonts;
    const result = fonts.shift()!;
    fonts.push(result);
    return result;
  };
}

export default Fonts;
