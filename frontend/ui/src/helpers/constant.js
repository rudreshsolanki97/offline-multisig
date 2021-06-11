export const TransferType = {
  native: "multiSigTransfer",
  token: "multiSigTransferToken",
};

export const LoaderType = {
  keystore: "keystore",
  privateKey: "privateKey",
};

export const PROJECT_NAME = "XDC Multi-Sig";

export const GetDefaultLoader = () =>
  localStorage.getItem("default-loader") || null;
export const GetDefaultPath = () =>
  localStorage.getItem("default-path") || null;
export const SetDefaultLoader = (loader) =>
  localStorage.setItem("deafult-loader", loader);
export const SetDefaultPath = (path) =>
  localStorage.setItem("deafult-path", path);
