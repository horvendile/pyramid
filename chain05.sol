pragma solidity ^0.4.17;

contract chain05 {

    address public creator;
    uint public cardCost;
    uint public numCards;

    struct List {
        bool exists;
        address[5] heirs;
        uint discount;
    }

    mapping (uint => List) private lists;

    event Sent(address indexed _receiver , uint _value);
    event Issue(uint ID , address h0 , address h1 , address h2 , address h3 , address h4 );

    modifier isCreator() {
        if ( msg.sender != creator) revert();
        _;
    }

    function chain05() payable public {
        creator = msg.sender;
        cardCost = msg.value;
        numCards = 234;
    }

    function createList(address[5] _newAddresses) public isCreator {
        numCards++;
        lists[numCards].heirs = _newAddresses;
        lists[numCards].exists = true;
    }

    function newLists(uint _fromID , address _buyer) private {
        for ( uint i = 1; i < 4 ; i++) {
            lists[numCards + i ].exists = true;
            for ( uint h = 0 ; h <4 ; h++ ) {
                lists[numCards+i].heirs[h] = lists[_fromID].heirs[h+1];
            }
            lists[numCards+i].heirs[4] = _buyer;
            logIssue(numCards+i);
        }
        numCards += 3;
    }

    function logIssue (uint _ID) public {
        Issue(_ID , lists[_ID].heirs[0] , lists[_ID].heirs[1] , lists[_ID].heirs[2] , lists[_ID].heirs[3] , lists[_ID].heirs[4] );
    }

    function buyList(uint _ID) public payable {
        address buyer = msg.sender;
        uint payment = msg.value;
        if (payment != cardCost) revert();
        if (!lists[_ID].exists) revert();
        transferPayment(cardCost / 2 , lists[_ID].heirs[0]);
        transferPayment(cardCost / 2 * (100 - lists[_ID].discount ) / 100 , lists[_ID].heirs[4]);
        newLists(_ID , buyer);
        lists[_ID].exists = false;
    }

    function getListDetails( uint _ID) public constant returns ( uint ID , bool listExists , address[5] listDetails , uint listDiscount) {
        ID = _ID;
        listExists = lists[_ID].exists;
        listDiscount = lists[_ID].discount;
        for (uint i = 0 ; i < 5 ; i++) {
            listDetails[i] = lists[_ID].heirs[i];
        }
    }

    function applyDiscount( uint _ID , uint _discount) public {
        if (lists[_ID].heirs[4] != msg.sender) revert();
        if ( _discount > 50 ) revert();
        if ( _discount < 0 ) revert();
        lists[_ID].discount = _discount;

    }

    function transferPayment(uint payment, address recipient) internal {
        recipient.transfer(payment);
        Sent(recipient, payment);
    }

    function kill() public isCreator {
        selfdestruct(creator);
    }

}
