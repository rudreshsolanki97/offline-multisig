const Xdc3 = require("xdc3");
const { utils } = Xdc3;
const { OwnerA, OwnerB, OwnerC } = require("./config/accounts");
const { ABI, address } = require("./config/contract");

const RPC = "https://rpc.apothem.network";

const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(RPC));

const accountA = xdc3.eth.accounts.privateKeyToAccount(OwnerA);
const accountB = xdc3.eth.accounts.privateKeyToAccount(OwnerB);
const accountC = xdc3.eth.accounts.privateKeyToAccount(OwnerC);

/**
 * 
 * 
 * 
 * 
 * 
 * 
"0xca35b7d915458ef540ade6068dfe2f44e8fa733c",
"0x14723a09acff6d2a60dcdf7aa4aff308fddc160c",
"0x4b0897b0513fdc7c541b6d9d7e929c4e5364d2db"
 * 
 * 
 * 
"0x0449cb09dec1c34f1067e00a83e5dD5af070eDE8",
"0xa13E001e70cf282fcaa645A22DD836c114ce6770",
"0x3350688768979711Af29280C7f71457108A9613a"
 * 

 **TO : xdcadb901c00b37a6079d5a2b9faa326070cbf7e4cf


 **token: xdc0b5394742e7f99321e4832f48d02c3db06e41c7d


 */

const TxIdentifierTransferXdc = {
  params: [
    "0xadb901c00b37a6079d5a2b9faa326070cbf7e4cf",
    "1000000000000000000",
  ],
  method: "multiSigTransfer",
};

const Streamline = async (txIdentifier) => {
  const contract = new xdc3.eth.Contract(ABI, address);
  const nonce = await contract.methods.getNonce().call();
  const hash = utils
    .soliditySha3(...txIdentifier.params, nonce)
    .toString("hex");

  return hash;
};

Streamline(TxIdentifierTransferXdc)
  .then((msg) => {
    const { signature: signatureA, messageHash } = xdc3.eth.accounts.sign(
      msg,
      accountA.privateKey
    );

    const { signature: signatureB } = xdc3.eth.accounts.sign(
      msg,
      accountB.privateKey
    );
    const { signature: signatureC } = xdc3.eth.accounts.sign(
      msg,
      accountC.privateKey
    );

    return { signatureA, signatureB, signatureC };
  })
  .then((resp) => {
    console.log(resp);
  });
