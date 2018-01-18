pragma solidity ^0.4.17;

contract chain {
    address public creator;
    uint256 public cardCost;

    uint256 numCards;
    mapping (uint256 => Card) cards;

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
        creator = msg.sender;
        Deposit(creator, msg.value, msg.data);
        }

    function newCards(uint256 _fromID, address _buyer) public {
        for ( uint i=1 ; i<4 ; i++) {
            cards[numCards+i] = Card( cards[_fromID].h1, cards[_fromID].h2, cards[_fromID].h3, cards[_fromID].h4, cards[_fromID].cm, _buyer );
            }
        numCards += 3;
        }
    function buyCard (uint256 _cardID) public payable {
        address cardBuyer = msg.sender;
        uint payment = msg.value;
        if (payment != cardCost) revert();
        transferPayment(cardCost / 2 , cards[_cardID].cb);
        transferPayment(cardCost / 2 , cards[_cardID].cm);
        newCards(_cardID, cardBuyer);


    }
    function transferPayment(uint payment, address recipient) internal {
        recipient.transfer(payment);
        Sent(recipient, payment);
  }


    function kill() public {
        if ( msg.sender != creator) revert();
        selfdestruct(creator);
        }
}
