fs = require('fs');
solc = require('solc');
Web3 = require('web3');
config = JSON.parse(fs.readFileSync('./config.json'));
web3 = new Web3(new Web3.providers.HttpProvider(config.addr));

function getHandleAtAddress(addr){
    var code = fs.readFileSync(config.contract_dir + '/eth-face-chain.sol').toString();
    var compiledCode = solc.compile(code);
    //TODO: move the abi definition into the config file, and update it when contracts change
    var abiDefinition = JSON.parse(compiledCode.contracts[':Face'].interface);

    var curr_face = new web3.eth.Contract(abiDefinition, addr);
    curr_face.methods.pubAddress().call().then(function(data){
        console.log(data.toString());
    });
}

getHandleAtAddress(process.argv[2]);
