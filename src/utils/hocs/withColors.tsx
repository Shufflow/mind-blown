import React from 'react';

import { getColor } from 'src/models/assets';

export interface ColorProps {
  fgColor: string;
  bgColor: string;
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
        fgColor: 'transparent',
        newColor: () => {
          const { bg, fg } = getColor();
          this.setState({ bgColor: bg, fgColor: fg });
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
