import React from 'react';

/**
 * Transforms any arrow func component into pure.
 */
const pure = <Props extends Object>(
  WrappedComponent: React.ComponentType<Props>,
): React.ComponentClass<Props> => {
  class Purified extends React.PureComponent<Props> {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return Purified;
};

export default pure;
