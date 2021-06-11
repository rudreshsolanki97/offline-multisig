const Xdc3 = require("xdc3");
const Accounts = require("xdc3-eth-accounts");
const { utils } = Xdc3;
const { TransferType } = require("./constant");

/**
 * 
 * 
 * Private key                                                         Address
503f38a9c967ed597e47fe25643985f032b072db8075426a92110f82df48dfcb    0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
7e5bfb82febc4c2c8529167104271ceec190eafdca277314912eaabdb67c6e5f    0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
cc6d63f85de8fef05446ebdd3c537c72152d0fc437fd7aa62b3019b79bd1fdd4    0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
638b5c6c8c5903b15f0d3bf5d3f175c64e6e98a10bdb9768a2003bf773dcb86a    0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB
f49bf239b6e554fdd08694fde6c67dac4d01c04e0dda5ee11abee478983f3bc0    0x617F2E2fD72FD9D5503197092aC168c91465E7f2
adeee250542d3790253046eee928d8058fd544294a5219bea152d1badbada395    0x17F6AD8Ef982297579C203069C1DbfFE4348c372
097ffe12069dcb3c3d99e6771e2cbf491a9b8b2f93ff4d3468f550c5e8264755    0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678
5f58e8b9f1867ef00578b6f03e159428ab168f776aa445bc3ecdb02c7db8e865    0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7
290e721ac87c7b3f31bef7b70104b9280ed3fa1425a59451490c9c02bf50d08f    0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C
27efe944ff128cf510ab447b529eec28772f13bf65ebf1cbd504192c4f26e9d8    0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC
3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511    0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c
2ac6c190b09897cd8987869cc7b918cfea07ee82038d492abce033c75c1b1d0c    0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C
dae9801649ba2d95a21e688b56f77905e5667c44ce868ec83f82e838712a2c7a    0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB
d74aa6d18aa79a05f3473dd030a97d3305737cbc8337d940344345c1f6b72eea    0x583031D1113aD414F02576BD6afaBfb302140225
71975fbf7fe448e004ac7ae54cad0a383c3906055a65468714156a07385e96ce    0xdD870fA1b7C4700F2BD7f44238821C26f7392148
 * 
 * 
 */

const generateStub = (type, params) => {
  switch (type) {
    case TransferType.token:
      return {
        params: [params.to, params.amount, params.token],
      };
    case TransferType.native:
    default:
      return {
        params: [params.to, params.amount],
      };
  }
};

export const Computehash = ({
  nonce,
  transferType = TransferType.native,
  ...params
}) => {
  const stub = generateStub(transferType, params);
  const hash = utils.soliditySha3(...stub.params, nonce).toString("hex");
  return hash;
};

export const Sign = (privateKey, msg) => {
  try {
    return new Accounts().sign(msg, privateKey);
  } catch (e) {
    return null;
  }
};

export const VerifyPrivateKey = (privateKey) => {
  if (privateKey.startsWith("0x")) privateKey = privateKey.replace("0x", "");
  return /^[0-9a-fA-F]{64}$/.test(privateKey);
};

export const GetAccountFromPK = (privateKey) => {
  if (!privateKey.startsWith("0x")) privateKey = "0x" + privateKey;
  return new Accounts().privateKeyToAccount(privateKey);
};

export const GetAccountFromKeystore = (keystore, pwd) => {
  try {
    if (typeof keystore !== "string") keystore = keystore.toString();
    return new Accounts().decrypt(keystore, pwd);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const IsValidAddress = (address) => {
  return utils.isAddress(address);
};
