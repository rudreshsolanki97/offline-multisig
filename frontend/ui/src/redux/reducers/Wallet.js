import { GetDefaultLoader, GetDefaultPath } from "../../helpers/constant";
import * as types from "../actions/types";

const initialWallet = {
  defaultPath: GetDefaultPath(),
  defaultLoader: GetDefaultLoader(),
  connected: false,
};

const Wallet = function (state = initialWallet, event) {
  switch (event.type) {
    case types.WALLET_LOADER_SUCCESS: {
      return { ...state, ...event.payload, connected: true };
    }
    case types.WALLET_LOADER_ERROR: {
      return { ...state, ...event.payload, connected: false };
    }
    default:
      return state;
  }
};

export default Wallet;
