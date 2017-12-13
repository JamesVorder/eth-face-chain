fs = require('fs');
solc = require('solc');
Web3 = require('web3');
config = JSON.parse(fs.readFileSync('./config.json'));
web3 = new Web3(new Web3.providers.HttpProvider(config.addr));

var code = fs.readFileSync(config.contract_dir + '/eth-face-chain.sol').toString();
var compiledCode = solc.compile(code);
var abiDefinition = JSON.parse(compiledCode.contracts[':' + process.argv[2]].interface);
console.log(JSON.stringify(abiDefinition));