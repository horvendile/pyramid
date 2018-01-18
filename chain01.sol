pragma solidity ^0.4.17;

contract chain {

  address public owner;

  event Deposit(address _sender, uint _value, bytes _message);
  event Sent(address indexed _receiver, uint _value);

  struct Card {
    address cb; //Card Beneficiary
    address h1; //Heir 1
    address h2; //Heir 2
    address h3; //Heir 3
    address h4; //Heir 4
    address cm; //Card Minter
    }
  // Constrctor function
  function chain() payable public {
    owner = msg.sender;
    Deposit(owner, msg.value, msg.data);
  }

  uint256 numCards;
  mapping (uint256 => Card) cards;

  function newCard(uint256 _fromID, address _buyer) public {

    //cardID = numCards++; // campaignID is return variable
    //address temp = cards[cardID].h1;
    // Creates new struct and saves in storage. We leave out the mapping type.
    for ( uint i=1 ; i<4 ; i++) {
      cards[numCards+i] = Card(   cards[_fromID].h1,
        cards[_fromID].h2,
        cards[_fromID].h3,
        cards[_fromID].h4,
        cards[_fromID].cm,
        _buyer
        );
      }

      numCards += 3;
    }

    function kill() public {
      if ( msg.sender != owner) revert();
      selfdestruct(owner);
    }
  }
