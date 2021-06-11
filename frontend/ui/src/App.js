import React from "react";

import Header from "./components/Header";
import { Row, Col, Container } from "react-bootstrap";

import SigningForm from "./components/SigningForm";

import "react-tabs/style/react-tabs.css";
import "./assets/scss/main.scss";
import { RenderQR } from "./components/common";
import _ from "lodash";
import { connect } from "react-redux";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hash: "",
      signature: "",
    };
  }

  render() {
    return (
      <div className="App dashboard">
        <Header />

        <Container className="panel-container">
          <Row>
            <Col className="left-panel" lg={6}>
              <SigningForm
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
                    <Col>{RenderQR(this.state.hash)}</Col>
                  </Row>

                  <Row>
                    <Col>{RenderQR(this.state.signature)}</Col>
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
