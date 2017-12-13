fs = require('fs');
solc = require('solc');
Web3 = require('web3');
config = JSON.parse(fs.readFileSync('./config.json'));
web3 = new Web3(new Web3.providers.HttpProvider(config.addr));

function getLatestFace(){
    return new Promise(function(resolve, reject) {
        web3.eth.getAccounts().then(function (from_accounts) {
            var code = fs.readFileSync(config.contract_dir + '/eth-face-chain.sol').toString();
            var compiledCode = solc.compile(code);

            var abiDefinition = JSON.parse(compiledCode.contracts[':Master'].interface);

            var MasterContract = new web3.eth.Contract(abiDefinition, config.master_contract);
            MasterContract.methods.getLatestFace().call().then(function (addr) {
                resolve(addr);
            });
        });
    });
}

getLatestFace().then(function (addr, err) {
    if(err){
        reject(err);
    }else{
        var code = fs.readFileSync(config.contract_dir + '/eth-face-chain.sol').toString();
        var compiledCode = solc.compile(code);
        //TODO: move the abi definition into the config file, and update it when contracts change
        var abiDefinition = JSON.parse(compiledCode.contracts[':Face'].interface);

        var curr_face = new web3.eth.Contract(abiDefinition, addr);
        curr_face.methods.twitter_handle().call().then(function(data){
            console.log(data.toString());
        });
    }
});
