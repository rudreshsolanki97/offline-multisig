import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { Modal, Container, Row, Col, Button } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import * as actions from "../redux/actions";
import {
  GetAccountFromKeystore,
  GetAccountFromPK,
  VerifyPrivateKey,
} from "../helpers/crypto";
import { PROJECT_NAME } from "../helpers/constant";
import { LOADER_BOX } from "./common";

const ImportFromFilerBodyComponent = ({ cb, defaultPath }) => {
  let fileReader;

  useEffect(() => {
    if (defaultPath) {
      handleFileChosen(defaultPath);
    }
  }, []);

  const handleFileRead = () => {
    const content = fileReader.result;
    cb(content);
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        id="input-file"
        accept=".json"
        onChange={(e) => handleFileChosen(e.target.files[0])}
      />
    </div>
  );
};

const PrivateKey = ({ cb, loading }) => {
  const [privateKey, setPrivateKey] = useState("");

  function renderMessage() {
    if (_.isEmpty(privateKey))
      return <div className="no-key">Enter Private Key</div>;
    const isValid = VerifyPrivateKey(privateKey);
    if (isValid)
      return <div className="valid-private-key">Private Key is valid</div>;
    else if (isValid === false)
      return <div className="invalid-private-key">Invalid Private Key</div>;
  }

  let btnName = "Submit";

  if (loading) {
    btnName = LOADER_BOX;
  }

  return (
    <div className="private-key">
      <Container>
        <Row>
          <input
            className="private-key__input"
            value={privateKey}
            onChange={(x) => setPrivateKey(x.target.value)}
          />
        </Row>

        <Row>
          <div className="private-key__message">{renderMessage()}</div>
        </Row>

        <Row>
          <Col>
            <Button
              className="u-float-r"
              onClick={() => {
                const account = GetAccountFromPK(privateKey);
                cb(account);
              }}
              disabled={loading}
            >
              {btnName}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const Keystore = ({ cb, loading, defaultPath }) => {
  const [keystore, setKeystore] = useState("");
  const [pwd, setPwd] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  let btnName = "Submit";

  if (loading) {
    btnName = LOADER_BOX;
  }

  return (
    <div className="keystore">
      <Container>
        <Row>
          <ImportFromFilerBodyComponent
            className="keystore-path__input"
            cb={setKeystore}
          />
        </Row>

        <Row>
          <input
            className="keystore-pwd__input"
            value={pwd}
            type="password"
            onChange={(x) => setPwd(x.target.value)}
          />
        </Row>

        <Row>
          <div className="private-key__message">{statusMessage}</div>
        </Row>

        <Row>
          <Col>
            <Button
              className="u-float-r"
              onClick={() => {
                const account = GetAccountFromKeystore(keystore, pwd);
                if (account === null) {
                  setStatusMessage("Invalid Password / Keystore");
                } else {
                  setStatusMessage("Successfully got the account");
                }
                cb(account);
              }}
              disabled={loading}
            >
              {btnName}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

class WalletLoader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputType: "keystore",
      inputData: { uploadedKeystore: "", privateKey: "" },
      showModal: false,
    };
  }

  accountCallback(account) {
    if (account === null)
      this.props.LoadWalletError("Error while fetching account");
    else this.props.LoadWalletSuccess(account);
  }

  render() {
    let MODAL_BTN_MSG = "Connect";

    if (this.props.wallet.connected) {
      MODAL_BTN_MSG = "Change Address";
    }

    return (
      <div>
        <Button
          variant={"primary"}
          onClick={() => this.setState({ showModal: true })}
        >
          {MODAL_BTN_MSG}
        </Button>

        <Modal
          className="wallet-connect"
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{PROJECT_NAME}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Tabs>
              <TabList>
                <Tab>Private Key</Tab>
                <Tab>Key Store</Tab>
              </TabList>

              <TabPanel>
                <PrivateKey
                  loading={this.state.loading}
                  cb={(x) => this.accountCallback(x)}
                />
              </TabPanel>

              <TabPanel>
                <Keystore
                  loading={this.state.loading}
                  cb={(x) => this.accountCallback(x)}
                />
              </TabPanel>
            </Tabs>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="u-float-r"
              variant="secondary"
              onClick={() => this.setState({ showModal: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ wallet }) {
  return { wallet };
}

export default connect(mapStateToProps, actions)(WalletLoader);
