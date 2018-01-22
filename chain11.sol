pragma solidity ^0.4.17;

contract chain {
    address public creator;
    uint256 public cardCost;

    uint256 numCards;
    mapping (uint256 => Card) cards;
    mapping (uint256 => bool) private cardExists;

    event Deposit(address _sender, uint _value, bytes _message);
    event Sent(address indexed _receiver, uint _value);
    event Issue(uint256 ID,address h0, address h1, address h2, address h3, address h4, address h5);

    struct Card {
        address h0; //Card Beneficiary
        address h1; //Heir 1
        address h2; //Heir 2
        address h3; //Heir 3
        address h4; //Heir 4
        address h5; //Card Minter
        }

    // Constrctor function
    function chain() payable public {
        creator = msg.sender;
        cardCost = msg.value;
        numCards = 234;
        cardExists[234] = true;
        cards[234].h0 = 0x2Ff10986b8877248112815f1d46F358B32161883;
        cards[234].h1 = 0x682c6f441bdda9632fe09e927EC404aF44A74BbB;
        cards[234].h2 = 0x25c14714cC7b1bF02100ff169f9EB58cfE55397b;
        cards[234].h3 = 0xAE0Aef78bff773F63C7F9BD916d1aFFa6C3cD319;
        cards[234].h4 = 0xe20ba7Fa60DD419123F99c64671EB95eF02767aF;
        cards[234].h5 = 0x7AbFAE5CD000C5d23e87A050c4E69A9D7D48B627;
        //cards[234].h1 = 0x68E58B950F17e8F386088bCCb703BBD88E415d2e;
        //cards[234].h1 = 0xb07F105801F833B0C3F983900B2a10c83dc83748;


        Deposit(creator, msg.value, msg.data);
        Issue(234, cards[234].h0, cards[234].h1, cards[234].h2, cards[234].h3, cards[234].h4, cards[234].h5);
        }

    function newCards(uint256 _fromID, address _buyer) public {
        for ( uint i=1 ; i<4 ; i++) {
            cards[numCards+i] = Card( cards[_fromID].h1, cards[_fromID].h2, cards[_fromID].h3, cards[_fromID].h4, cards[_fromID].h5, _buyer );
            cardExists[numCards+i] = true;
            logIssue(numCards+i);
            }
        numCards += 3;
        }

    function logIssue(uint256 _cardID) public {
        Issue(_cardID, cards[_cardID].h0, cards[_cardID].h1, cards[_cardID].h2, cards[_cardID].h3, cards[_cardID].h4, cards[_cardID].h5 );
    }

    function buyCard (uint256 _cardID) public payable {
        address cardBuyer = msg.sender;
        uint payment = msg.value;
        if (payment != cardCost) revert();
        if (!cardExists[_cardID]) revert();
        transferPayment(cardCost / 2 , cards[_cardID].h0);
        transferPayment(cardCost / 2 , cards[_cardID].h5);
        cardExists[_cardID] = false;
        newCards(_cardID, cardBuyer);
    }

    function getCardDetails (uint256 _cardID) public constant returns (address[6] cardDetails) {
        cardDetails[0] = cards[_cardID].h0;
        cardDetails[1] = cards[_cardID].h1;
        cardDetails[2] = cards[_cardID].h2;
        cardDetails[3] = cards[_cardID].h3;
        cardDetails[4] = cards[_cardID].h4;
        cardDetails[5] = cards[_cardID].h5;
    }

    function checkCardExists (uint256 _cardID) public constant returns (bool exists) {
        exists = cardExists[_cardID];
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
