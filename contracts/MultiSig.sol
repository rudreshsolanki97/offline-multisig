pragma solidity ^0.4.24;


/**
 * @title IERC20
 * @dev Interface to ERC20 token
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

library ECDSA {

  /**
   * @dev Recover signer address from a message by using their signature
   * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
   * @param signature bytes signature, the signature is generated using web3.eth.sign()
   */
  function recover(bytes32 hash, bytes signature)
    internal
    pure
    returns (address)
  {
    bytes32 r;
    bytes32 s;
    uint8 v;

    // Check the signature length
    if (signature.length != 65) {
      return (address(0));
    }

    // Divide the signature in r, s and v variables with inline assembly.
    assembly {
      r := mload(add(signature, 0x20))
      s := mload(add(signature, 0x40))
      v := byte(0, mload(add(signature, 0x60)))
    }

    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }

    // If the version is correct return the signer address
    if (v != 27 && v != 28) {
      return (address(0));
    } else {
      // solium-disable-next-line arg-overflow
      return ecrecover(hash, v, r, s);
    }
  }

  /**
    * toEthSignedMessageHash
    * @dev prefix a bytes32 value with "\x19Ethereum Signed Message:"
    * and hash the result
    */
  function toEthSignedMessageHash(bytes32 hash)
    internal
    pure
    returns (bytes32)
  {
    return keccak256(
      abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
    );
  }
}


contract MultiSig {
    
    using ECDSA for bytes32;
    
    address public ownerA;
    address public ownerB;
    address public ownerC;
    
    struct TransferStruct {
        address to;
        uint256 amount;
        address token;
        bytes32 approvedMessageHash;
        bool approvedA;
        bool approvedB;
        bool approvedC;
    }
    
    struct HashApproval {
        bool approvedA;
        bool approvedB;
        bool approvedC;
    }
    
    event HashApproved(address to, uint256 amount, address owner, address token);
    event Transfer(address to, uint256 amount, bool approveA, bool approveB, bool approveC, address token);
    
    TransferStruct[] public transfers;
    mapping(bytes32 => HashApproval) public messageHashApproval;
    
    constructor(address _ownerA,address _ownerB,address _ownerC) public payable {
        ownerA=_ownerA;
        ownerB=_ownerB;
        ownerC=_ownerC;
    }
    
    function _approveHashByOwner(address owner, bytes32 hash) internal {
        require(isOwner(owner),"MultiSig: signer not owner"); // is valid sender & for current TX
        if (owner==ownerA) messageHashApproval[hash].approvedA = true;
        else if (owner==ownerB) messageHashApproval[hash].approvedB = true;
        else if (owner==ownerC) messageHashApproval[hash].approvedC = true;
    }
    
    function multiSigTransfer(bytes signature, address to, uint256 amount) public {
        uint256 nonce = getNonce();
        bytes32 hash = prefixHash(keccak256(abi.encodePacked(to, amount, nonce)));
        address addr = hash.recover(signature);
        
        require(isOwner(addr),"MultiSig: signer not owner"); // is valid sender & for current TX
        require(amount <= address(this).balance,"MultiSig: not enough balance in contract");
        
        _approveHashByOwner(addr, hash);
        emit HashApproved(to, amount, addr, address(0));
        
        uint256 count = getHashAppovalCount(hash);
        if (count >=2) {
            // consensus met, can transfer out.
            to.transfer(amount);
            TransferStruct memory _transfer = TransferStruct(to, amount,address(0), hash, messageHashApproval[hash].approvedA,messageHashApproval[hash].approvedB,messageHashApproval[hash].approvedC);
            transfers.push(_transfer);
            emit Transfer(to, amount, messageHashApproval[hash].approvedA,messageHashApproval[hash].approvedB,messageHashApproval[hash].approvedC, address(0));
        }
    }
    
    
    function multiSigTransferToken(bytes signature, address to, uint256 amount, IERC20 token) public {
        uint256 nonce = getNonce();
        bytes32 hash = prefixHash(keccak256(abi.encodePacked(to, amount, nonce)));
        address addr = hash.recover(signature);
        
        require(isOwner(addr),"MultiSig: signer not owner"); // is valid sender & for current TX
        require(amount <= token.balanceOf(address(this)),"MultiSig: not enough balance in contract");
        
        _approveHashByOwner(addr, hash);
        emit HashApproved(to, amount, addr, address(token));
        
        uint256 count = getHashAppovalCount(hash);
        if (count >=2) {
            // consensus met, can transfer out.
            token.transfer(to, amount);
            TransferStruct memory _transfer = TransferStruct(to, amount,address(token), hash, messageHashApproval[hash].approvedA,messageHashApproval[hash].approvedB,messageHashApproval[hash].approvedC);
            transfers.push(_transfer);
            emit Transfer(to, amount, messageHashApproval[hash].approvedA,messageHashApproval[hash].approvedB,messageHashApproval[hash].approvedC, address(token));
        }
    }

    
    function getNonce() public view returns(uint256) {
        return transfers.length;
    }
    
    function isOwner(address addr) public view returns(bool) {
        return addr==ownerA || addr==ownerB || addr==ownerC;
    }
    
    function getHashAppovalCount(bytes32 hash) public view returns(uint256) {
        uint256 count=0;
        if (messageHashApproval[hash].approvedA) count++;
        if (messageHashApproval[hash].approvedB) count++;
        if (messageHashApproval[hash].approvedC) count++;
        return count;
    }
    
    function hasApproved(address owner, bytes32 hash) public view returns(bool) {
        require(isOwner(owner),"MultiSig: signer not owner"); // is valid sender & for current TX
        if (owner==ownerA) return messageHashApproval[hash].approvedA == true;
        else if (owner==ownerB) return  messageHashApproval[hash].approvedB == true;
        else if (owner==ownerC) return  messageHashApproval[hash].approvedC == true;
    }
    
    function prefixHash(bytes32 msgHash) private pure returns(bytes32) {
      bytes memory prefix = "\x19Ethereum Signed Message:\n32";
      bytes32 prefixedHash = keccak256(abi.encodePacked(prefix,msgHash));
      return prefixedHash;
    }
    
    
    function () payable external {}
}
