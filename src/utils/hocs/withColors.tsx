import React from 'react';

import { getColor } from 'src/models/assets';

export interface ColorProps {
  fgColor: string;
  bgColor: string;
}

const withColor = <T extends Object>(
  WrappedComponent: React.ComponentType<T>,
): React.ComponentClass<T> => {
  class ComponentWithColors extends React.PureComponent<T, ColorProps> {
    state = {
      bgColor: 'transparent',
      fgColor: 'transparent',
    };

    componentDidMount() {
      const { bg, fg } = getColor();
      this.setState({ bgColor: bg, fgColor: fg });
    }

    render() {
      return <WrappedComponent {...this.state} {...this.props} />;
    }
  }

  return ComponentWithColors;
};

export default withColor;
