
{// var settings //
  var mainAccount , web3 , bal , tHash , maxWager ;
  var abiArray = [ { "constant": true, "inputs": [], "name": "creator", "outputs": [ { "name": "", "type": "address", "value": "0x2ff10986b8877248112815f1d46f358b32161883" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_ID", "type": "uint256" } ], "name": "logIssue", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_ID", "type": "uint256" } ], "name": "getListDetails", "outputs": [ { "name": "ID", "type": "uint256", "value": "237" }, { "name": "listExists", "type": "bool", "value": true }, { "name": "listDetails", "type": "address[5]", "value": [ "0xae0aef78bff773f63c7f9bd916d1affa6c3cd319", "0xe20ba7fa60dd419123f99c64671eb95ef02767af", "0x7abfae5cd000c5d23e87a050c4e69a9d7d48b627", "0x68e58b950f17e8f386088bccb703bbd88e415d2e", "0x2ff10986b8877248112815f1d46f358b32161883" ] } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_newAddresses", "type": "address[5]" } ], "name": "createList", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_ID", "type": "uint256" } ], "name": "buyList", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "cardCost", "outputs": [ { "name": "", "type": "uint256", "value": "100000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_receiver", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Sent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "ID", "type": "uint256" }, { "indexed": false, "name": "h0", "type": "address" }, { "indexed": false, "name": "h1", "type": "address" }, { "indexed": false, "name": "h2", "type": "address" }, { "indexed": false, "name": "h3", "type": "address" }, { "indexed": false, "name": "h4", "type": "address" } ], "name": "Issue", "type": "event" } ] ;
  var targetAddress = "0xB1FA390C3613d0984E02B32e3F44C9D53FcD2E30";
  var gas = 20*10**9
}

function trunc(addr) {
  return addr.substring(0,4)+"..."+addr.substring(addr.length-2);
}

function autorun(){
  init();
/*
  Particles.init({
    selector: '.background',
    color: '#ffffff',
    maxParticles: 50,
    connectParticles: true,
    speed:1,
    sizeVariations:3,
  });
*/
}

function init() { // FUNCTION IS EXECUTED ON PAGE LOAD
  {// Checks Web3 support
    if(typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
      // If there's a web3 library loaded, then make your own web3
      web3 = new Web3(web3.currentProvider);
      } else if (typeof Web3 !== 'undefined') {
        // If there isn't then set a provider
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      } else if(typeof web3 == 'undefined') {
        // If there is neither then this isn't an ethereum browser
        // browser.style.visibility = "visible";
        document.getElementById("browser").style.visibility = "visible";
        return;
    }
  }//////////////////////////////////////////////////////////////////////
  {// Get user's ethereum account and Balance
    web3.eth.getAccounts(function(error,accounts) {
      // show the floating baloon
      if (error || !accounts || accounts.length == 0) {
        document.getElementById("browser").style.visibility = "visible";
      } else {
        mainAccount = accounts[0];
        document.getElementById("ma").textContent = mainAccount.toUpperCase();

        web3.eth.getBalance(mainAccount, function(error, accountBalance) {
          if(!error) {
            var unformattedAccountBalance = Math.round(accountBalance/10**9)/10**9;
            document.getElementById("ba").textContent = unformattedAccountBalance.toFixed(9);
          }
        });
      }
    });
  }///////////////////////////////////////////////////////////////////
  {// Display Contract Address and Balance
    document.getElementById("ca").textContent = targetAddress.toUpperCase();
    web3.eth.getBalance(targetAddress, function(err, contractBalance) {
      if(!err) {
        document.getElementById("cb").textContent = (Math.round(contractBalance/10**9)/10**9).toFixed(9);
      }
    });
  }  ///////////////////////////////////////////////////////////////////////
  {// Instantiate Contract
    var outPut = "";
    var listCount = 0;
    var MyContract = web3.eth.contract(abiArray);
    var myContractInstance = MyContract.at(targetAddress);
  }//////////////////////////////////////////////////////////////////////
  {// watch for an event with {some: 'args'}
    //var events = myContractInstance.allEvents({fromBlock: 0});
    var events = myContractInstance.allEvents( {fromBlock: 	1660632});
    //var events = myContractInstance.allEvents({});
    events.watch(function(error, result){
      if(result.args._receiver==mainAccount){console.log(result.args);}

    });
  }/////////////////////////////////////////////////////////////////
  {// get Highest Card Number (numCards)
    web3.eth.contract(abiArray).at(targetAddress).creator(function(error,creatorAddress) {
      console.log(creatorAddress);
    });

  }//////////////////////////////////////////////////////////////////////

  {// Get Cards by ID
    listCount = 0;
    for (i=200;i<300;i++) {
      web3.eth.contract(abiArray).at(targetAddress).getListDetails(i,function(error,details) {
        //console.log(details);
        listNumber = details[0].c[0];
        listExists = details[1];
        //if (listExists) {
        if (listExists) {
          cardID= details[0].c[0];
          headString = cardID;
          //headString="000000"+cardID.toString(16);
          //headString = headString.substring(headString.length-6,headString.length);
          cardFill = "<div class = 'cardHead'>" + headString + "</div>";
          showCard = true;
          for ( h = 0 ; h<5 ; h++ ) {
            if (details[2][h] == mainAccount) {
              showCard = true;
              cardFill = cardFill + "<div style='color:red'>" + trunc(details[2][h]) + "</div>";
            }
            else {
              cardFill = cardFill + "<div>" + trunc(details[2][h]) + "</div>";
            }
          }
          if(showCard){
          var newCard = document.createElement("div");
          newCard.setAttribute("id", "card"+listCount);
          newCard.setAttribute("class", "card");
          newCard.setAttribute("onclick", "drawCard("+details[0].c[0]+")");
          var node = document.createTextNode("");
          newCard.appendChild(node);
          var element = document.getElementById("cardSpace");
          element.appendChild(newCard);
          document.getElementById("card"+listCount).innerHTML = cardFill;
          colCount = Math.floor(window.innerWidth/80);
          row = Math.floor(listCount/colCount);
          col = (listCount - row*colCount);
          document.getElementById("card"+listCount).style.top = row*115+"px";
          document.getElementById("card"+listCount).style.left = col*80+"px";
          listCount++;
          //console.log(details[0].c[0],details);
        }
        }
      })
    }
  }/////////////////////////////////////////////////////////////////////
  //getEventLogs()

}
function getEventLogs() {
  // Or pass a callback to start watching immediately
  web3.eth.contract(abiArray).at(targetAddress).Issue({},function(error,details) {
  //var MyContract = web3.eth.contract(abiArray);
  //var myContractInstance = MyContract.at(targetAddress);

  //myContractInstance.Issue({blockNumber:1662039}, function(error, result) {
    if (!error)
    console.log(details);
  });
}
function drawCard (cardToBeDrawn) {
  web3.eth.contract(abiArray).at(targetAddress).getListDetails(cardToBeDrawn,function(error,cardDetails) {
    if(!error) {
      document.getElementById("fullCard").style.visibility = "visible";
      document.getElementById("fcHead").textContent = cardDetails[0].c[0];
      for (i=0;i<5;i++) {
        document.getElementById("fc"+i).textContent = cardDetails[2][i];
        if (cardDetails[2][i] == mainAccount) {
          document.getElementById("fc"+i).style.color = "red";
        }
        else {
          document.getElementById("fc"+i).style.color = "black";
        }
      }

    }
  })

}
function buyList(ID) {
  console.log(ID);
  transactionData = "0x9ecf86c800000000000000000000000000000000000000000000000000000000000000"+Number(ID).toString(16);
  console.log(transactionData);
  submitTransaction(targetAddress,100000000000000000,transactionData)
  }


function hideFullCard(){
  document.getElementById("fullCard").style.visibility = "collapse";
}

function spawnCard() {
  window.open("spawn.html","_blank");
}

function submitTransaction(_contractAddress , _value , _data) {
  console.log( "<marquee>Waiting for the block to be mined</marquee>");
  web3.eth.sendTransaction({to: _contractAddress, value: _value, data:_data, gasPrice: gas },
    function(err, transactionHash) {
      if(!err) {
        tHash = transactionHash;
        var filter = web3.eth.filter('latest')
        filter.watch(function(err, hash) {
          if (!err) {
            web3.eth.getBlock(hash, function(err,result) {
              if(!err) {
                var transactionArray = result.transactions;
                for ( i=0 ; i<transactionArray.length ; i++ ) {
                  if (transactionHash == transactionArray[i]) {
                    web3.eth.getTransactionReceipt(transactionHash,
                      function(err,transactionReceipt) {
                        if(!err) {
                          console.log(transactionReceipt);
                        }
                      });
                    }
                  };
                }
              })
            }
          });
        }
      })
    }
