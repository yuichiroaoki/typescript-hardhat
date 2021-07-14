import { ethers } from "hardhat";


async function main() {
  const Contract = await ethers.getContractFactory("SendEther");
  
  const provider = ethers.provider;
  const network = await provider.getNetwork();
  const networkName = network.name;
  
  const ETHERSCAN_TX_URL = `https://${networkName}.etherscan.io/tx/`

  const contract = await Contract.deploy();

  console.log("Token deployed to:", contract.address);
  console.log(
    `You did it! View your tx here: ${ETHERSCAN_TX_URL}${contract.deployTransaction.hash}`
  )
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });