
/** @type import('hardhat/config').HardhatUserConfig */

require('dotenv').config();
require("@nomicfoundation/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan");

const {API_URL,PRIVATE_KEY,API_KEY} = process.env;
module.exports = {
  solidity: "0.8.18",
  defaultNetwork : "mumbai",
  networks:{
    mumbai:{
      url:API_URL,
      accounts:[`0x${ PRIVATE_KEY}`]
    }
  },
  etherscan:{
    apiKey:API_KEY
  
  }
};
