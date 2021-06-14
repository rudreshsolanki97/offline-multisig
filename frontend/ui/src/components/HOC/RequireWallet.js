import React from "react";
import { connect } from "react-redux";

const DefaultFallback = () => <div className="u-text-center blue">Wallet Not Connnected</div>;

export const RequireWallet =
  (Fallback = DefaultFallback) =>
  (ComponentX) => {
    class ComposedComponent extends React.Component {
      render() {
        if (!this.props.wallet.connected) return <Fallback />;

        return <ComponentX {...this.props} />;
      }
    }

    function mapStateToProps({ wallet }) {
      return { wallet };
    }

    return connect(mapStateToProps)(ComposedComponent);
  };
