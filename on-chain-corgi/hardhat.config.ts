import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    "optimism-goerli": {
      url: `https://opt-goerli.g.alchemy.com/v2/${process.env
        .ALCHEMY_API_KEY!}`,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: { optimisticGoerli: process.env.OPTIMISM_ETHERSCAN_API_KEY! },
  },
};

export default config;
