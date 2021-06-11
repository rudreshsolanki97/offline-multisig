import * as types from "./types";

export const LoadWalletSuccess = ({ address, privateKey }) => {
  return {
    type: types.WALLET_LOADER_SUCCESS,
    payload: {
      address,
      privateKey,
    },
  };
};

export const LoadWalletError = (error) => {
  return {
    type: types.WALLET_LOADER_ERROR,
    error: error,
  };
};
