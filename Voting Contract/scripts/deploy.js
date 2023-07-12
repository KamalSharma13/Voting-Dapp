
const hre = require("hardhat");

async function main() {
const Voting =await hre.ethers.getContractFactory("voting")

const voting = await Voting.deploy(["A","B","C","D"],100);
const address = await voting.getAddress();
console.log("contract address",address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
