/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "ChainlinkClient",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ChainlinkClient__factory>;
    getContractFactory(
      name: "AggregatorV3Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AggregatorV3Interface__factory>;
    getContractFactory(
      name: "ChainlinkRequestInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ChainlinkRequestInterface__factory>;
    getContractFactory(
      name: "ENSInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ENSInterface__factory>;
    getContractFactory(
      name: "LinkTokenInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LinkTokenInterface__factory>;
    getContractFactory(
      name: "OperatorInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OperatorInterface__factory>;
    getContractFactory(
      name: "OracleInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OracleInterface__factory>;
    getContractFactory(
      name: "PointerInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PointerInterface__factory>;
    getContractFactory(
      name: "ENSResolver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ENSResolver__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "RideHailing",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RideHailing__factory>;

    getContractAt(
      name: "ChainlinkClient",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ChainlinkClient>;
    getContractAt(
      name: "AggregatorV3Interface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AggregatorV3Interface>;
    getContractAt(
      name: "ChainlinkRequestInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ChainlinkRequestInterface>;
    getContractAt(
      name: "ENSInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ENSInterface>;
    getContractAt(
      name: "LinkTokenInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LinkTokenInterface>;
    getContractAt(
      name: "OperatorInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OperatorInterface>;
    getContractAt(
      name: "OracleInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OracleInterface>;
    getContractAt(
      name: "PointerInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PointerInterface>;
    getContractAt(
      name: "ENSResolver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ENSResolver>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "RideHailing",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RideHailing>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
