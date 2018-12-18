import React from 'react';

/**
 * Transforms any arrow func component into pure.
 */
const pure = <P extends any>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentClass<P> => {
  class Purified extends React.PureComponent<P> {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return Purified;
};

export default pure;
