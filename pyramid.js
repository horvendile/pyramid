
var mainAccount , web3 , bal , tHash , maxWager ;
{
  var abiArray = [ { "constant": false, "inputs": [ { "name": "_amount", "type": "uint256" } ], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x2ff10986b8877248112815f1d46f358b32161883" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_receiver", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Sent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "_hs", "type": "uint256" } ], "name": "HashSource", "type": "event" } ];
  var targetAddress = "0x300432bA68574DABB8872B7DE90CE84dde861b8c";
  var gas = 20*10**9
}
function trunc(addr) {
  return addr.substring(0,4)+"..."+addr.substring(addr.length-2);
}


function autorun(){
  init();

  Particles.init({
    selector: '.background',
    color: '#888888',
    maxParticles: 50,
    connectParticles: true,
    speed:1,
    sizeVariations:3,
  });

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
    /////////////////////////////////////////////////////////////////
    /*
    // Check if there are available accounts

    // Checks Web3 support
    if (typeof web3 !== 'undefined') {
    // If there isn't then set a provider
    web3 = new Web3(web3.currentProvider);
    } else { // use Infura if it's not there
    web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/xb1hnXsk67Yb6pIlVPvv"));
    }
    */
  }//////////////////////////////////////////////////////////////////////
  {// Display Contract Address and Balance
    document.getElementById("ca").textContent = targetAddress.toUpperCase();
    web3.eth.getBalance(targetAddress, function(err, contractBalance) {
      if(!err) {
        console.log(contractBalance);
      }
    });
  }///////////////////////////////////////////////////////////////////////
  {// Contract History
    var outPut = "";
    var listCount = 0;
    var MyContract = web3.eth.contract(abiArray);
    var myContractInstance = MyContract.at('0x300432bA68574DABB8872B7DE90CE84dde861b8c');
    // watch for an event with {some: 'args'}
    var events = myContractInstance.allEvents({fromBlock: 0});
    events.watch(function(error, result){

      if(result.args._receiver) {
        console.log(result);
      listCount ++;
      var newCard = document.createElement("div");
      newCard.setAttribute("id", "card"+listCount);
      newCard.setAttribute("class", "card");
      var node = document.createTextNode("");
      newCard.appendChild(node);
      var element = document.getElementById("hashList");
      element.appendChild(newCard);

      document.getElementById("card"+listCount).innerHTML = trunc(result.transactionHash)+"<br>"+trunc(result.args._receiver);
      document.getElementById("card"+listCount).style.top = 100+18*listCount+"px";
      document.getElementById("card"+listCount).style.left = 100+15*listCount+"px";





      }
    });
  }/////////////////////////////////////////////////////////////////
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
    // Get contract balance
    web3.eth.getBalance(targetAddress, function(err, contractBalance) {
      if(!err) {
        document.getElementById("cb").textContent = (Math.round(contractBalance/10**9)/10**9).toFixed(9);
      }
    });
  }///////////////////////////////////////////////////////////////////
}

function submitTransaction(_contractAddress , _value , _data) {
  document.getElementById("leftHash").innerHTML = "<marquee>Waiting for the block to be mined</marquee>";
  document.getElementById("rightHash").textContent = "";
  clearRolls();
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
                          updateScreen(transactionReceipt);
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

function updateScreen(receipt) {
  var generatedHash = String(receipt.logs[0].data).toUpperCase();
  processHash(generatedHash);
  payout = receipt.logs[1].data / 10**18;
  payoutText = "You have won "+payout.toFixed(2)+" Ether"
  document.getElementById("payOut").textContent = payoutText;
  document.getElementById("payOut").style.visibility = "visible";
  transactionHTML = "<a href='https://rinkeby.etherscan.io/tx/"+tHash+"' target='_blank'>"+tHash+"</a>";
  document.getElementById("transactionAddress").innerHTML = transactionHTML;
  /*
  alert(receipt.logs[1].data.toUpperCase()+'\n\nYou have won: '+
  payout +
  ' Ξther\n\nFrom ')
  */
  init();
}
function processHash(h) {
  lh = h.substring(0,h.length-8);
  rh = h.substring(h.length-8,h.length);
  document.getElementById("leftHash").textContent = lh;
  document.getElementById("rightHash").textContent = rh;
  for (i=0;i<8;i++) {
    document.getElementById("roll"+i).textContent = h.substring(58+i,59+i);
  }
}
function clearRolls() {
      document.getElementById("rollTable").style.visibility = "visible";
      document.getElementById("rollTable").style.margin = "30px";
      for (i=0;i<8;i++) {
        document.getElementById("roll"+i).textContent = "";
      }
    }
{//var hexArray = ["0","1","2","3","4","5","6","7","8","9","A","B","C","Đ","Ξ","F"]
  var numbtns = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var bets = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var total = 0;
  var adjustedTotal = 0;
}


function updateString(){
  messageString = "0x";
  for (x=0;x<16;x++) {
    messageString = messageString+"0"+numbtns[x];
  }
  //  document.getElementById("message").textContent = messageString;
}

function updateTotal(){
  if(bet.value>maxWager){
    wagerOverflow()
    bet.value = maxWager;
    return;
  }
  adjustedTotal = Math.round(total*bet.value*1000)/1000;
  document.getElementById('totalBets').textContent = adjustedTotal;
}

function wagerOverflow() {
  var overFlowHTML = "Overflow"+
  "<button style = 'bottom:20px; right:20px; position:absolute' onclick='hidePanel()'>OK</button>";
  document.getElementById("panel").innerHTML = overFlowHTML;
  document.getElementById("panel").style.backgroundColor = "pink";
  document.getElementById("panel").style.width = "300px";
  document.getElementById("panel").style.height = "200px";
  showPanel();
}
