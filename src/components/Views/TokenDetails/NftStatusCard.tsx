import { useEffect, useState } from "react";
import { CHAIN_IDS_TO_NAMES } from "config/constants/chains";
import { InnerCard, Line, SideCard, StatusTags } from "./styles";
import { Box, Flex } from "components/Box";
import { ChainArray, StatusStyles } from "config/constants";
import useTheme from "components/hooks/useTheme";
import { Text } from "components/Text";
import Button from "components/Button";
import {
    NFTResponse,
    nftNetworks,
    DeployStatus,
    TokenStatusText,
} from "config/types";
import { copyToClipboard, truncateAddress, viewExplorer } from "utils";
import { CircleCheckedIcon, LinkIcon, WalletAddressIcon } from "components/Svg";
import { toast } from "react-toastify";
import SkeletonLoader from "components/SkeletonLoader";
import { useHistory, useLocation } from "react-router";
import { BigNumber, ethers } from "ethers";
import { useAccount, useFeeData, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { catERC721 } from "config/abi/catERC721";
import Spinner from "components/SpinnerCircle";

interface IProp {
    nftStatus: NFTResponse;
    deployedOnAllChain: boolean;
    statusInternalLoader: boolean;
}

const NftStatusCard: React.FC<IProp> = ({
    nftStatus,
    deployedOnAllChain,
    statusInternalLoader,
}) => {
    const { theme } = useTheme();
    const history = useHistory();
    const location = useLocation();
    const [copied, setCopied] = useState(false);
    const [nftAddressIndex, setNFTAddressIndex] = useState<number>(undefined);
    const { data: signer, refetch } = useSigner();
    const { data: feeData } = useFeeData({chainId: nftStatus?.nftInfo?.tokenMintChainId});
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const [nftSupply, setNftSupply] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);
    const [maxNFTSupply, setMaxNFTSupply] = useState<number>()
    const { switchNetworkAsync } = useSwitchNetwork();

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }
    }, [copied]);

    const getStatusTag = (token: nftNetworks) => {
        return (
            <StatusTags
                tabStyle={StatusStyles[token.status]}
                justifyContent={"center"}
            >
                {TokenStatusText[token.status]}
            </StatusTags>
        );
    };

    const nftTotalSupply = async (signer) => {
        const genericAddress = nftStatus?.nftNetworks?.find(res => res?.genericTokenAddress != null)?.genericTokenAddress
        if (genericAddress) {
            const contract = new ethers.Contract(genericAddress, catERC721, signer);
            const totalSupply = await contract?.totalSupply()
            setNftSupply(totalSupply?.toString());
        }
        else {
            const filteredContract = nftStatus?.nftNetworks?.find(
                (res) => res?.chainId == nftStatus?.nftInfo?.tokenMintChainId
            )?.address;
            const contract = new ethers.Contract(filteredContract, catERC721, signer);
            setTimeout(async () => {
                const mintedSupply = await contract?.mintedSupply()
                const maxSupply = await contract?.maxSupply();
                setMaxNFTSupply(maxSupply?.toString())
                setNftSupply(mintedSupply?.toString());
            }, 1000);
        }
    };

    const mintNFT = async () => {
        try {
            if (nftStatus?.nftInfo?.tokenMintChainId !== chain?.id) {
                await switchNetworkAsync(nftStatus?.nftInfo?.tokenMintChainId)
            }
            setLoading(true);
            const filteredContract = nftStatus?.nftNetworks.find(
                (res) => res?.chainId == nftStatus?.nftInfo?.tokenMintChainId
            ).address;
            const refetchSigner = await refetch()
            const signer = refetchSigner?.data
            const contract = new ethers.Contract(filteredContract, catERC721, signer);
            const gasPrice = feeData.gasPrice;
            const gasPriceBigNumber = BigNumber.from(gasPrice)
                .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
                .div(BigNumber.from(10000));
            let gasLimit = await contract.estimateGas.mint(address);
            gasLimit = BigNumber.from(gasLimit)
                .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
                .div(BigNumber.from(10000));
            const mintNFT = await contract.mint(address, {
                gasPrice: gasPriceBigNumber,
                gasLimit: gasLimit,
            });
            const tx = await mintNFT.wait(1);
            nftTotalSupply(signer);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(`Error while minting.`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
            });
        }
    };

    useEffect(() => {
        const deployStatus = nftStatus?.nftNetworks.find((res) => res.chainId === nftStatus.nftInfo.tokenMintChainId)?.status
        if (nftStatus && signer && DeployStatus.DEPLOYED === deployStatus) {
            nftTotalSupply(signer)
        }
    }, [signer, deployedOnAllChain])

    return (
        <Flex flexDirection={"row"}>
            <Flex flexDirection={"column"} width={"100%"}>
                {nftStatus?.nftNetworks.map((token, index) => {
                    return (
                        <InnerCard key={token?.chainId} className={"inner-token"}>
                            <Flex
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                p={"10px 20px 5px"}
                            >
                                <Flex alignItems={"center"} width={"100%"}>
                                    <Box className="svg-icon">
                                        {ChainArray.find((x) => x.chainId === token.chainId)?.icon}
                                    </Box>
                                    <Text
                                        fontFamily={theme.fonts.primary}
                                        fontWeight={theme.fonts.medium}
                                        fontSize={"16px"}
                                        ml={'7px'}
                                    >
                                        {CHAIN_IDS_TO_NAMES[token.chainId]}
                                    </Text>
                                </Flex>
                                {statusInternalLoader &&
                                    token.status !== DeployStatus.DEPLOYED &&
                                    token.status !== DeployStatus.FAILED &&
                                    token.status !== DeployStatus.LOW_FEES ? (
                                    <Flex>
                                        <SkeletonLoader
                                            width={"98px"}
                                            height={"34px"}
                                            styles={{ padding: "1px 0px", borderRadius: "4px" }}
                                        />
                                    </Flex>
                                ) : (
                                    <Flex mb={"5px"} width={"118px"} height={"32px"}>
                                        {getStatusTag(token)}
                                    </Flex>
                                )}
                            </Flex>
                            <Line />
                            <Flex
                                mt={"15px"}
                                ml={"25px"}
                                alignContent="center"
                                alignItems={"center"}
                            >
                                <Text
                                    fontFamily={theme.fonts.primary}
                                    fontWeight={theme.fonts.light}
                                    fontSize={"14px"}
                                >
                                    {"Contract address"}
                                </Text>
                                <Flex className="pointer-cursor" onClick={() => viewExplorer(token?.chainId, token?.deploymentTxHash)}>
                                    <Text
                                        fontFamily={theme.fonts.primary}
                                        color={theme.colors.textDisabled}
                                        fontWeight={theme.fonts.light}
                                        fontSize={"14px"}
                                        ml={"15px"}
                                    >
                                        {statusInternalLoader && token?.address === undefined ? (
                                            <SkeletonLoader height={"14px"} width={"150px"} />
                                        ) : token?.address ? (
                                            truncateAddress(token?.address)
                                        ) : (
                                            "-"
                                        )}
                                    </Text>
                                    {token?.deploymentTxHash && <LinkIcon ml={'7px'} width={"12px"} color={theme.colors.textDisabled} />}
                                </Flex>
                                {token?.address && (
                                    <Box
                                        ml={"8px"}
                                        height={"23px"}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            copyToClipboard(token?.address);
                                            setCopied(true);
                                            setNFTAddressIndex(index);
                                        }}
                                    >
                                        {" "}
                                        {copied && nftAddressIndex === index ? (
                                            <CircleCheckedIcon
                                                fill={"none"}
                                                width={"17"}
                                                mr={"5px"}
                                                height={"23"}
                                            />
                                        ) : (
                                            <WalletAddressIcon mr={"5px"} />
                                        )}
                                    </Box>
                                )}
                            </Flex>
                            {nftStatus?.nftInfo?.tokenMintChainId === token?.chainId && (
                                <Flex mt={"15px"} ml={"26px"} alignItems={"center"}>
                                    <Flex width={"110px"}>
                                        <Text
                                            fontFamily={theme.fonts.primary}
                                            fontWeight={theme.fonts.light}
                                            fontSize={"14px"}
                                        >
                                            {"NFT supply"}
                                        </Text>
                                    </Flex>
                                    <Text
                                        fontFamily={theme.fonts.primary}
                                        fontWeight={theme.fonts.light}
                                        color={theme.colors.textDisabled}
                                        fontSize={"14px"}
                                        ml={"25px"}
                                    >
                                        {nftSupply ? +nftSupply === 0 ? "-" : +nftSupply : "-"}
                                    </Text>
                                </Flex>
                            )}
                            {nftStatus?.nftInfo?.tokenMintChainId === token?.chainId && token?.status === DeployStatus.DEPLOYED &&
                                token?.genericTokenAddress === null && (
                                    <Flex justifyContent={"flex-end"} mr={"20px"}>
                                        <Box mt={"16px"}>
                                            <Button
                                                height={"32px"}
                                                width={"118px"}
                                                type={"button"}
                                                variant={"tertiary"}
                                                disabled={nftSupply === maxNFTSupply}
                                                onClick={() => mintNFT()}
                                            >
                                                <Flex justifyContent={"center"}>
                                                    <Text
                                                        fontWeight={theme.fonts.semiBold}
                                                        fontSize={"14px"}
                                                        ml={"6px"}
                                                    >
                                                        {loading ?
                                                            <Flex><Spinner radius={9} /></Flex>
                                                            : "Mint"
                                                        }
                                                    </Text>
                                                </Flex>
                                            </Button>
                                        </Box>
                                    </Flex>
                                )}
                        </InnerCard>
                    );
                })}
            </Flex>
            <Flex ml={"50px"}>
                <SideCard>
                    <Text
                        fontFamily={theme.fonts.primary}
                        fontWeight={theme.fonts.light}
                        color={
                            deployedOnAllChain ? theme.colors.textDisabled : theme.colors.text
                        }
                        fontSize={"14px"}
                        paddingTop={"6px"}
                    >
                        {"You can move your NFTs across chains"}
                    </Text>
                    <Box mt={"16px"}>
                        <Button
                            height={"44px"}
                            width={"306px"}
                            type={"button"}
                            variant={"tertiary"}
                            disabled={deployedOnAllChain}
                            onClick={() => history.push("/bridge/nft")}
                        >
                            <Flex justifyContent={"center"}>
                                <Text
                                    fontWeight={theme.fonts.semiBold}
                                    fontSize={"14px"}
                                    ml={"6px"}
                                >
                                    Bridge
                                </Text>
                            </Flex>
                        </Button>
                    </Box>
                </SideCard>
            </Flex>
        </Flex>
    );
};

export default NftStatusCard;
