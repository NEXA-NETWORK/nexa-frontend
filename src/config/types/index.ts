import { BigNumberish } from "ethers";

export type IChainOption = {
  value: number;
  label: string;
  icon: any;
};

export type BridgeTransaction = {
  to: string;
  value: string;
  data: string;
  isSigned: boolean;
  clientId: string;
  gasFee?: BigNumberish;
};

export type EstimateResponse = {
  totalGasFeeInUSDOnMintingChain: number;
  totalGasFeeInTokenMintingChain: number;
  chainId: number;
  salt: string;
  transaction: BridgeTransaction;
  gasFee?: BigNumberish;
};

export type TokenInfo = {
  decimals?: number;
  initiatedDeploymentFeeOnChainId?: number;
  initiatedDeploymentTxHash?: string;
  name?: string;
  owner?: string;
  params?: string;
  salt?: string;
  symbol?: string;
  totalSupply?: string;
};

export type NFTInfo = {
  decimals?: number;
  initiatedDeploymentFeeOnChainId?: number;
  initiatedDeploymentTxHash?: string;
  name?: string;
  owner?: string;
  params?: string;
  salt?: string;
  symbol?: string;
  totalSupply?: number;
  baseUri?: string;
  tokenMintChainId?: number;
}

export type TokenNetwork = {
  chainId: number;
  feePaidByUser: string;
  status: string;
  tokenInfo: string;
  address: `0x${string}`;
  supply: string;
  deployer?: string;
  genericTokenAddress?: `0x${string}`;
  deploymentTxHash?: string;
};

export type nftNetworks = {
  status: string;
  chainId: number;
  feePaidByUser?: string;
  owner: string;
  address: `0x${string}`;
  balance: string;
  deployer?: string;
  genericTokenAddress?: `0x${string}`;
  deploymentTxHash?: string;
}

export enum CATType {
  CATType = "CATType",
  CATProxyType = "CATProxyType",
  GENERIC = "GENERIC",
}

export type SaltResponse = {
  tokenInfo?: TokenInfo;
  tokenNetworks?: TokenNetwork[];
};

export type NFTResponse = {
  nftInfo?: NFTInfo;
  nftNetworks?: nftNetworks[];
}

export type TokenInfoResponse = {
  deployedNetworks: Array<any>;
  isProxy: boolean;
  tokenInfo: TokenInfo;
  type: string;
};

export type NFTInfoResponse = {
  deployedNetworks: Array<any>;
  isProxy: boolean;
  nftInfo: NFTInfo;
  type: string;
};

export type BridgeTokenResponse = {
  decimals: number;
  initiatedDeploymentFeeOnChainId: number;
  initiatedDeploymentTxHash: string;
  name: string;
  networks: TokenNetwork[];
  owner: string;
  params: string;
  salt: string;
  symbol: string;
  tokenMintChainId: number;
  totalSupply: string;
};

export type BridgeNFTResponse = {
  decimals: number;
  initiatedDeploymentFeeOnChainId: number;
  initiatedDeploymentTxHash: string;
  name: string;
  networks: TokenNetwork[];
  owner: string;
  params: string;
  salt: string;
  symbol: string;
  tokenMintChainId: number;
  totalSupply: string;
};

export type BridgeEstimateResponse = {
  id: string;
  totalGasFeeInTokenSourceChain: number;
  totalGasFeeInUSD: number;
  transactions: BridgeTransaction[];
};

export type BridgeStatusResponse = {
  amount: string;
  errorRetryCount: number;
  fromChainId: number;
  fromToken: string;
  relayerBridgeFeeInNative: string;
  relayerBridgeFeeInUSD: string;
  relayerBridgeFeeInWei: string;
  status: TokenBridgeStatus;
  toChainId: number;
  toToken: string;
  initiateBridgeTxHash: string;
  relayerBridgeTxHash: string;
  totalBlockConfirmation: number;
  blockConfirmationDone: number;
};

export enum DeployStatus {
  PENDING = "PENDING",
  DEPLOYED = "DEPLOYED",
  FAILED = "FAILED",
  IN_PROGRESS = "IN_PROGRESS",
  LOW_FEES = "LOW_FEES",
  QUERIED = "QUERIED",
  WAITING_FOR_CONFIRMATION = "WAITING_FOR_CONFIRMATION",
}

export enum TokenStatusText {
  PENDING = "Pending",
  DEPLOYED = "Deployed",
  FAILED = "Failed",
  IN_PROGRESS = "In progress",
  LOW_FEES = "Low Fees",
  QUERIED = "Pending",
  WAITING_FOR_CONFIRMATION = "In progress",
}

export enum TokenBridgeStatus {
  QUERIED = "QUERIED",
  BRIDGE_INITIATED = "BRIDGE_INITIATED",
  IN_QUEUE = "IN_QUEUE",
  LOW_FEES = "LOW_FEES",
  BRIDGE_COMPLETED = "BRIDGE_COMPLETED",
  BRIDGE_ERROR = "BRIDGE_ERROR",
}
