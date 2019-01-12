import React from 'react';

import { getColor } from 'src/models/assets';

export interface BasicColors {
  bgColor: string;
  fgColor: string;
}

export interface ColorProps extends BasicColors {
  dark: string;
  isDark: boolean;
  light: string;
  newColor: () => void;
}

const withColor = <T extends Object>(
  WrappedComponent: React.ComponentType<T>,
): React.ComponentClass<any> => {
  class ComponentWithColors extends React.PureComponent<T, ColorProps> {
    constructor(props: T) {
      super(props);

      this.state = {
        bgColor: 'transparent',
        dark: 'transparent',
        fgColor: 'transparent',
        isDark: false,
        light: 'transparent',
        newColor: () => {
          const { dark, light } = getColor();
          const isDark = !!Math.floor(Math.random());
          this.setState({
            dark,
            isDark,
            light,
            bgColor: isDark ? dark : light,
            fgColor: isDark ? light : dark,
          });
        },
      };
    }

    componentDidMount() {
      this.state.newColor();
    }

    render() {
      return <WrappedComponent {...this.state} {...this.props} />;
    }
  }

  return ComponentWithColors;
};

export default withColor;
