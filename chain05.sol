pragma solidity ^0.4.17;

contract chain05 {
    address public creator;
    uint256 public cardCost;
    address public player;
    //address[5] public heirList;
     uint256 numCards;

    struct List {
        bool exists;
        address[5] heirs;
    }

    mapping (uint256 => bool) private cardExists;
    mapping (uint256 => List) private lists;

    event Deposit(address _sender, uint _value, bytes _message);
    event Sent(address indexed _receiver, uint _value);
    event Issue(uint256 ID,address h0, address h1, address h2, address h3, address h4, address h5);

    function chain05() payable public {
        creator = msg.sender;
        cardCost = msg.value;
        numCards = 234;
    }

    function createList(address[5] _newAddresses) public {
        if (msg.sender != creator) revert();
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

    function logIssue (uint256 _ID) public {
        Issue(_ID , lists[_ID].heirs[0] , lists[_ID].heirs[1] , lists[_ID].heirs[2] , lists[_ID].heirs[3] , lists[_ID].heirs[4] ,0 );
    }

    function buyList(uint _ID) public payable {
        address buyer = msg.sender;
        uint payment = msg.value;
        if (payment != cardCost) revert();
        if (!lists[_ID].exists) revert();
        transferPayment(cardCost / 2 , lists[_ID].heirs[0]);
        transferPayment(cardCost / 2 , lists[_ID].heirs[4]);
        lists[_ID].exists = false;
        newLists(_ID , buyer);
    }

    function getListDetails( uint256 _ID) public constant returns ( uint256 ID , List listDetails) {
        ID = _ID;
        listDetails.exists = lists[_ID].exists;
        for (uint i = 0 ; i < 5 ; i++) {
            listDetails.heirs[i] = lists[_ID].heirs[i];
        }
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
