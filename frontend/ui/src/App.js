import React from "react";

import Header from "./components/Header";
import { Row, Col, Container } from "react-bootstrap";

import { RequireWallet } from "./components/HOC/RequireWallet";
import SigningForm from "./components/SigningForm";

import "react-tabs/style/react-tabs.css";
import "./assets/scss/main.scss";

import NamedQR from "./components/common/NamedQR";
import _ from "lodash";
import { connect } from "react-redux";
import HighlightedText from "./components/common/HighlightedText";

const ComposedSigningForm = RequireWallet()(SigningForm);
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hash: "",
      signature: "",
    };
  }

  renderAddress() {
    if (!this.props.wallet.connected) return "";

    return (
      <div className="u-float-r">
        <span>Loaded Address</span>
        <span>
          <HighlightedText text={this.props.wallet.address} color="blue" />
        </span>
      </div>
    );
  }

  render() {
    return (
      <div className="App dashboard">
        <Header />

        <Container className="panel-container">
          <Row>
            <Col>{this.renderAddress()}</Col>
          </Row>
          <Row>
            <Col className="left-panel" lg={6}>
              <ComposedSigningForm
                privateKey={this.props.wallet.privateKey}
                updateHash={(h) => this.setState({ hash: h })}
                updateSignature={(s) => this.setState({ signature: s })}
              />
            </Col>
            <Col className="right-panel" lg={6}>
              {!_.isEmpty(this.state.hash) &&
              !_.isEmpty(this.state.signature) ? (
                <Container>
                  <Row>
                    <Col>
                      <h2 className="u-text-center">QR Code</h2>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <NamedQR data={this.state.hash} title={"Message Hash"} />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <NamedQR
                        data={this.state.signature}
                        title={"Signature"}
                      />
                    </Col>
                  </Row>
                </Container>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps({ wallet }) {
  return { wallet };
}

export default connect(mapStateToProps)(App);
