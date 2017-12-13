fs = require('fs');
solc = require('solc');
Web3 = require('web3');
config = JSON.parse(fs.readFileSync('./config.json'));
web3 = new Web3(new Web3.providers.HttpProvider(config.addr));

var code = fs.readFileSync(config.contract_dir + '/eth-face-chain.sol').toString();
var compiledCode = solc.compile(code);
var abiDefinition = JSON.parse(compiledCode.contracts[':Master'].interface)

var defs = {
    "abiDefinition": abiDefinition,
    "compiledCode": compiledCode
};

deployMaster();

function deployMaster(){
    var MasterContract = new web3.eth.Contract(defs.abiDefinition);

    web3.eth.getAccounts().then(function(from_accounts){
        MasterContract.deploy({
            data: "0x" + defs.compiledCode.contracts[':Master'].bytecode,
            arguments: []
        }).send({
            from: from_accounts[0],
            gas: 4500000000
        },function(err, txH){
            if(err){
                console.log(err);
            } else{
                console.log("OG callback says: " + txH);
            }
        })
        .on('error', function(error){
            console.log("Error callback says: " + error);
        })
        .on('transactionHash', function(txH){
            console.log("transactionHash callback says:" + txH);
        })
        .on('receipt', function(receipt){
            console.log("receipt callback says: " + receipt.contractAddress);
        });
    });
}
