pragma solidity ^0.4.24;


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
    }
    
    event Transfer(address to, uint256 amount, bool approveA, bool approveB, bool approveC);
    
    TransferStruct[] public transfers;
    
    constructor(address _ownerA,address _ownerB,address _ownerC) public payable {
        ownerA=_ownerA;
        ownerB=_ownerB;
        ownerC=_ownerC;
    }
    
    function multiTransfer(bytes signatureA, bytes signatureB,  bytes signatureC, address to, uint256 amount) public {
        uint256 nonce = transfers.length;
        bytes32 hash = keccak256(abi.encodePacked(to, amount, nonce));
        
        address addrA = hash.recover(signatureA);
        address addrB = hash.recover(signatureB);
        address addrC = hash.recover(signatureC);
        
        bool approvedA = addrA==ownerA;
        bool approvedB = addrB==ownerB;
        bool approvedC = addrC==ownerC;
        
        bool canTransfer = (approvedA&&approvedB)||(approvedB&&approvedC)||(approvedC&&approvedA);
        
        require(canTransfer,'MultiSig: not enough confirmation');
        require(amount<=address(this).balance,'MultiSig: not enough balance in contract');
        
        to.transfer(amount);
        emit Transfer(to, amount, approvedA, approvedB, approvedC);
    }
}
