import { EstimateResponse, IChainOption, NFTResponse, CATType, BridgeStatusResponse } from "config/types";
import { client } from "./token.service";
import { url } from "./urls";
import { MORALIS_API } from "config/constants";

export const getNFTInfo = async (chainId: number, token: string) => {
    try {
        const res = await client.get(
            `${url.nftInfo}?chainId=${chainId}&token=${token}`
        );
        return res?.data;
    } catch (e: any) {
        throw new Error("Error while getting nft info: " + e?.message);
    }
};

export const getNFTBridgeEstimates = async (
    fromChainId: number,
    fromToken: string,
    toChainId: number,
    toChainToken: string,
    from: string,
    to: string,
    tokenId: string
): Promise<any> => {
    try {
        const res = await client.get(
            `${url.bridgeNFT}?fromChainId=${fromChainId}&fromToken=${fromToken}&toChainId=${toChainId}&toToken=${toChainToken}&from=${from}&to=${to}&tokenId=${tokenId}`
        );
        return res?.data;
    } catch (e: any) {
        throw new Error("Error while fetching bridge estimates: " + e?.message);
    }
};

export const getNFTDeployEstimates = async (
    name: string,
    symbol: string,
    baseUri: string,
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
        let estimateUrl = `${url.deploynft}?name=${name}&symbol=${symbol}&baseUri=${baseUri}&totalSupply=${tokenSupply}&${destArrayMap}tokenMintingChain=${tokenMintingChain.value}&owner=${owner}&type=${catType}`;
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

export const getNFTDeployStatus = async (salt: string): Promise<NFTResponse> => {
    try {
        const res = await client.get(`${url.nftdeployStatus}${salt}`);
        return res?.data;
    } catch (e: any) {
        throw new Error("Error while fetching deploy status: " + e?.message);
    }
};

export const getAllNFTs = async () => {
    try {
        const res = await client.get(`${url.allNFTs}`);
        return res?.data;
    } catch (e: any) {
        throw new Error("Error while getting nft info: " + e?.message);
    }
};

export const getNftBridgeStatus = async (
    id: string
): Promise<BridgeStatusResponse> => {
    try {
        const res = await client.get(`${url.nftbridgeStatus}${id}`);
        return res?.data?.transaction;
    } catch (e: any) {
        throw new Error("Error while fetching deploy status: " + e?.message);
    }
};

export const getMoralisNFTs = async (walletAddress: string, tokenAddress: string, chainID) => {
    const config = {
        headers: {
            "x-api-key": MORALIS_API
        }
    };

    try {
        const moralisQuery = `${url.moralisEndpoint}${walletAddress}/nft?chain=${chainID}&format=decimal&token_addresses=${tokenAddress}&normalizeMetadata=true&media_items=true`
        const res = await client.get(moralisQuery, config)
        return res
    }
    catch (e: any) {
        throw new Error("Error while getting nft info: " + e?.message);
    }
}