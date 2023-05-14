import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const accounts = [process.env.PRIVATE_KEY!];

const config: HardhatUserConfig & {
  etherscan: { apiKey: { [key: string]: string } };
} = {
  solidity: "0.8.18",
  networks: {
    "optimism-goerli": {
      url: `https://opt-goerli.g.alchemy.com/v2/${process.env
        .ALCHEMY_API_KEY!}`,
      accounts: accounts,
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${process.env
        .ALCHEMY_API_KEY!}`,
      accounts: accounts,
    },
    matic: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env
        .ALCHEMY_API_KEY!}`,
      accounts: accounts,
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: accounts,
    },
    scrollAlpha: {
      url: "https://alpha-rpc.scroll.io/l2",
      accounts: accounts,
    },
    neonlabs: {
      url: "https://devnet.neonevm.org",
      accounts: accounts,
      chainId: 245022926,
      allowUnlimitedContractSize: false,
      timeout: 1000000,
    },
    mantleTestnet: {
      chainId: 5001,
      url: "https://rpc.testnet.mantle.xyz",
      accounts: accounts,
    },
    linea: {
      url: "https://rpc.goerli.linea.build/",
      chainId: 59140,
      accounts: accounts,
    },
  },
  etherscan: {
    apiKey: {
      optimisticGoerli: process.env.OPTIMISM_ETHERSCAN_API_KEY!,
      optimisticEthereum: process.env.OPTIMISM_ETHERSCAN_API_KEY!,
      polygon: process.env.POLYGONSCAN_API_KEY!,
      gnosis: process.env.GNOSISSCAN_API_KEY!,
    },
  },
};

export default config;
