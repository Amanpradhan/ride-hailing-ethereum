import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"
import "hardhat-contract-sizer"
import "dotenv/config"
import "@openzeppelin/hardhat-upgrades"
import "hardhat-docgen";
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

declare module "hardhat/types/config" {
    interface HardhatUserConfig {
      docgen?: {
        path: string;
        clear?: boolean;
        runOnCompile?: boolean;
      };
    }
  }

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 500,
                    },
                },
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        },
        polygon_mumbai: {
            url: "https://rpc-mumbai.maticvigil.com",
            accounts: [PRIVATE_KEY],
        },
        // goerli: {
        //     url: GOERLI_RPC_URL,
        //     accounts:
        //         GOERLI_PRIVATE_KEY !== undefined ? [GOERLI_PRIVATE_KEY] : [],
        //     saveDeployments: true,
        //     chainId: 5,
        // },
    },
    etherscan: {
        // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            // rinkeby: ETHERSCAN_API_KEY,
            // kovan: ETHERSCAN_API_KEY,
            goerli: ETHERSCAN_API_KEY,
            // avalanche: SNOWTRACE_API_KEY,
            // avalancheFujiTestnet: SNOWTRACE_API_KEY,
            // polygon: POLYGONSCAN_API_KEY,
        },
    },

    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
        token: "AVAX",
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    docgen: {
        path: './docs',
        clear: true,
        runOnCompile: true,
    },
    mocha: {
        timeout: 300000, // 200 Seconds
    },
}

export default config;
