//expected output: 0xd50E0f28f166b368701e5e300350ec9c06542DE4
//0xdc9e352c56eB52B82ad98BBe296a64fD8bf8462F
//0x555D073F366C5F0747a69a7079B560bfACD461d4
//0xEf78cDA70078f45d56B417Adc1A99e3A0B5B6C91
//0xB797ABC4265c4E779d97b60330DCb9eD3f7bf76d
//0x58E609Ba513757595B958400DdF330b01EeCfb90

fs = require('fs');
solc = require('solc');
Web3 = require('web3');
config = JSON.parse(fs.readFileSync('./config.json'));
web3 = new Web3(new Web3.providers.HttpProvider(config.addr));

function getLatestFace(){
    web3.eth.getAccounts().then(function(from_accounts) {
        var code = fs.readFileSync(config.contract_dir + '/eth-face-chain.sol').toString();
        var compiledCode = solc.compile(code);

        var abiDefinition = JSON.parse(compiledCode.contracts[':Master'].interface);

        var MasterContract = new web3.eth.Contract(abiDefinition, config.master_contract);
        MasterContract.methods.getLatestFace().call().then(console.log);
    });
}

getLatestFace();