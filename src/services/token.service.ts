import axios from "axios";
import { API_BASE_URL } from "config/constants";
import { url } from "./urls";
import {
  BridgeStatusResponse,
  CATType,
  EstimateResponse,
  IChainOption,
  SaltResponse,
} from "config/types";

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDeployEstimates = async (
  name: string,
  symbol: string,
  decimals: number,
  tokenSupply: string,
  destinationChains: string[],
  tokenMintingChain: IChainOption,
  owner: string,
  catType: string,
  salt?: string,
  tokenAdress?: string
): Promise<EstimateResponse> => {
  try {
    let destArrayMap = "";
    for (let chain of destinationChains) {
      destArrayMap += `destinationChains=${chain}&`;
    }
    let estimateUrl = `${url.deploy}?name=${name}&symbol=${symbol}&decimals=${decimals}&totalSupply=${tokenSupply}&${destArrayMap}tokenMintingChain=${tokenMintingChain.value}&owner=${owner}&type=${catType}`;
    if (salt) {
      estimateUrl += `&salt=${salt}`;
    }
    if (catType === CATType.GENERIC) {
      estimateUrl += `&genericTokenAddress=${tokenAdress}`;
    }

    const res = await client.get(estimateUrl);
    return res?.data;
  } catch (e: any) {
    throw new Error("Error while fetching deployment estimates: " + e?.message);
  }
};

export const getDeployStatus = async (salt: string): Promise<SaltResponse> => {
  try {
    const res = await client.get(`${url.deployStatus}${salt}`);
    return res?.data;
  } catch (e: any) {
    throw new Error("Error while fetching deploy status: " + e?.message);
  }
};

export const getTokenInfo = async (chainId: number, token: string) => {
  try {
    const res = await client.get(
      `${url.tokenInfo}?chainId=${chainId}&token=${token}`
    );
    return res?.data;
  } catch (e: any) {
    throw new Error("Error while getting token info: " + e?.message);
  }
};

export const getAllTokens = async () => {
  try {
    const res = await client.get(`${url.allTokens}`);
    return res?.data;
  } catch (e: any) {
    throw new Error("Error while getting token info: " + e?.message);
  }
};

export const getBridgeEstimates = async (
  fromChainId: number,
  fromToken: string,
  toChainId: number,
  toChainToken: string,
  from: string,
  to: string,
  amount: string
): Promise<any> => {
  try {
    const res = await client.get(
      `${url.bridgeToken}?fromChainId=${fromChainId}&fromToken=${fromToken}&toChainId=${toChainId}&toToken=${toChainToken}&from=${from}&to=${to}&amount=${amount}`
    );
    return res?.data;
  } catch (e: any) {
    throw new Error("Error while fetching bridge estimates: " + e?.message);
  }
};

export const getBridgeStatus = async (
  id: string
): Promise<BridgeStatusResponse> => {
  try {
    const res = await client.get(`${url.bridgeStatus}${id}`);
    return res?.data?.transaction;
  } catch (e: any) {
    throw new Error("Error while fetching deploy status: " + e?.message);
  }
};
