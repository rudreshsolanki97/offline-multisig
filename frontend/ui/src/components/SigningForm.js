import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import Switch from "react-switch";
import { TransferType } from "../helpers/constant";
import { Computehash, IsValidAddress, Sign } from "../helpers/crypto";
import { SwitchStyle2 } from "./common";
import CodeSnippet from "./common/CodeSnippet";

const InitialForm = {
  amount: { key: "Amount", value: "", info: "" },
  to: { key: "To", value: "", info: "" },
  nonce: { key: "Nonce", value: "", info: "" },
  tokenAddress: {
    key: "Token Address",
    value: "",
    info: "",
  },
  isToken: false,
  valid: false,
  computed: false,
  hash: "",
  signature: "",
};

class SigningForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...InitialForm };
  }

  setAndValidate(stateName, value, type) {
    let isValid = false,
      msg = "";

    switch (type) {
      case "address": {
        isValid = IsValidAddress(value);
        break;
      }
      default:
        isValid = true;
    }

    if (isValid === false) {
      msg = `invalid ${stateName}`;
    }

    const q = { ...this.state[stateName], value, info: msg };

    this.setState({
      [stateName]: q,
    });
  }

  renderField(stateName, opts = {}) {
    if (opts && opts.show === false) return "";
    return (
      <Row>
        <Col className="signing-form__field" lg={4}>
          {this.state[stateName].key}
        </Col>
        <Col className="signing-form__value" lg={8}>
          <input
            type={opts.type || "text"}
            value={this.state[stateName].value}
            onChange={(x) => {
              this.setAndValidate(
                stateName,
                x.target.value,
                opts.type || "text"
              );
            }}
          />
        </Col>
        <Col className={`signing-form__info red`}>
          {this.state[stateName].info}
        </Col>
      </Row>
    );
  }

  render() {
    const resetBtn = this.state.computed ? (
      <Button
        onClick={() => {
          this.setState({ ...InitialForm });
          this.props.updateHash("");
          this.props.updateSignature("");
        }}
        className="reset-button"
      >
        Reset
      </Button>
    ) : (
      ""
    );

    return (
      <div className="signing-form">
        <Container>
          <Row>
            <Col className="signing-form__title u-text-center">
              <h2>Compute Signature</h2>
            </Col>
          </Row>

          <Row>
            <Col>
              <div style={{ width: "100%" }}>
                <span className="u-float-r hsb">
                  <span>Is Token</span>
                  <span>
                    <Switch
                      className="act-btn"
                      {...SwitchStyle2}
                      onChange={(e) => {
                        this.setState({ isToken: e });
                      }}
                      checked={this.state.isToken}
                    />
                  </span>
                </span>
              </div>
            </Col>
          </Row>

          {this.renderField("tokenAddress", {
            show: this.state.isToken,
            type: "text",
          })}
          {this.renderField("to", { type: "address" })}
          {this.renderField("amount", {
            type: "number",
          })}
          {this.renderField("nonce", {
            type: "number",
          })}

          <Row>
            <Col>
              {resetBtn}
              <Button
                onClick={() => {
                  const transferType = this.state.isToken
                    ? TransferType.token
                    : TransferType.native;
                  const hash = Computehash({
                    nonce: this.state.nonce.value,
                    transferType,
                    to: this.state.to.value,
                    amount: this.state.amount.value,
                  });

                  const sig = Sign(this.props.privateKey, hash);

                  this.setState(
                    { hash: hash, computed: true, signature: sig.signature },
                    () => {
                      this.props.updateHash(hash);
                      this.props.updateSignature(sig);
                    }
                  );
                }}
                className="signing-form__submit"
              >
                Compute
              </Button>
            </Col>
          </Row>

          {this.state.computed ? (
            <>
              <Row>
                <Col>
                  <CodeSnippet
                    title="Message Hash"
                    collapsable={true}
                    code={this.state.hash}
                  ></CodeSnippet>
                </Col>
              </Row>

              <Row>
                <Col>
                  <CodeSnippet
                    title="Signature"
                    collapsable={true}
                    code={this.state.signature}
                  ></CodeSnippet>
                </Col>
              </Row>
            </>
          ) : (
            ""
          )}
        </Container>
      </div>
    );
  }
}

export default SigningForm;
