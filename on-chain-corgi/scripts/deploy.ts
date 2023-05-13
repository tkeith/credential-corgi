import { ethers } from "hardhat";

async function main() {
  const Corgi = await ethers.getContractFactory("Corgi");
  const corgi = await Corgi.deploy();

  await corgi.deployed();

  console.log(`Corgi deployed to ${corgi.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
