import { Box, Flex } from "components/Box";
import Button from "components/Button";
import Spinner from "components/SpinnerCircle";
import { Text } from "components/Text";
import { ChainArray, inputStyles } from "config/constants";
import {
    BridgeEstimateResponse,
    BridgeNFTResponse,
    BridgeTransaction
} from "config/types";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import {
    getAllNFTs,
    getNFTBridgeEstimates
} from "services/nft.service";
import { increaseGasFee, noExponents } from "utils";
import {
    useAccount,
    useBalance,
    useFeeData,
    useNetwork,
    usePrepareSendTransaction,
    useSendTransaction,
    useSwitchNetwork,
    useWaitForTransaction,
} from "wagmi";
import useTheme from "../../hooks/useTheme";
import { InnerSection, MainContainer } from "../Bridge/styles";
import { NFTinput } from "./styles";
import NFTmodal from "components/NFTModal";

type SelectOptions = {
    label: string;
    value: number;
    icon: any;
    address: `0x${string}`;
    genericTokenAddress: `0x${string}`;
};

const BridgeNFT = () => {
    const { theme } = useTheme();
    const history = useHistory();
    const [supportedBlockChains, setSupportedBlockChains] = useState<
        Array<SelectOptions>
    >([]);
    const [selectedToChain, setSelectedToChain] = useState<SelectOptions>();
    const [selectedFromChain, setSelectedFromChain] = useState<SelectOptions>();
    const [nfts, setNfts] = useState<Array<BridgeNFTResponse>>([]);
    const [isFetchEstimates, setIsFetchEstimates] = useState<boolean>(false);
    const [selectedChainNetworks, setSelectedChainNetworks] = useState([])
    const [nftId, setNftId] = useState<number>(0)

    const { Option } = components;
    const IconOption = (props) => (
        <Option className="chain-options" {...props}>
            <Box className="svg-icon" mr={'5px'}>{props.data.icon}</Box>
            {props.data.label}
        </Option>
    );

    const SingleValue = (props) => (
        <Flex alignItems={'center'}>
            <Box className="select-svg-icon" mt={'7px'} mr={'5px'}>{props.data.icon}</Box>
            {props.data.label}
        </Flex>
    );

    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();
    const { data: gasFee } = useFeeData({chainId: selectedFromChain?.value})

    const { data: balanceData } = useBalance({
        address,
        chainId: selectedFromChain?.value,
    });

    const isValid: boolean =
        isConnected && nftId &&
            selectedFromChain &&
            selectedToChain
            ? true
            : false;

    const [bridgeEstimate, setBridgeEstimate] =
        useState<BridgeEstimateResponse>();

    const [prepareTx, setPrepareTx] = useState<BridgeTransaction>(null);

    const { config } = usePrepareSendTransaction({
        request: {
            to: prepareTx?.to,
            from: address,
            value: prepareTx?.value,
            data: prepareTx?.data,
            gasPrice: prepareTx?.gasFee,
        },
    });
    const {
        data: txData,
        isLoading,
        sendTransaction,
    } = useSendTransaction(config);

    const { isLoading: isWaitLoading, isSuccess: isTxSuccess } =
        useWaitForTransaction({
            hash: txData?.hash,
        });

    useEffect(() => {
        fetchNFTs();
    }, []);

    useEffect(() => {
        if (selectedChainNetworks) {
            const availableChains = selectedChainNetworks.map((x) => {
                return {
                    chainId: x.chainId,
                    address: x.address,
                    genericTokenAddress: x?.genericTokenAddress,
                };
            });
            const selectedNftChains = [];
            ChainArray.forEach((item) => {
                for (let chain of availableChains) {
                    if (chain.chainId === item.chainId) {
                        selectedNftChains.push({
                            value: item.chainId,
                            label: item.name,
                            icon: item.icon,
                            address: chain.address,
                            genericTokenAddress: chain.genericTokenAddress,
                        });
                    }
                }
                return selectedNftChains;
            });
            setSelectedFromChain(null);
            setSelectedToChain(null);
            setSupportedBlockChains(selectedNftChains);
        }
    }, [selectedChainNetworks]);

    useEffect(() => {
        if (chain?.id) {
            const defaultChain: SelectOptions = supportedBlockChains.find(data => data.value === chain?.id)
            setSelectedFromChain(defaultChain)
        }
    }, [nftId, chain])

    useEffect(() => {
        fetchEstimates();
    }, [isConnected, selectedFromChain, selectedToChain]);

    useEffect(() => {
        if (isValid === false) {
            setBridgeEstimate(undefined);
        }
    }, [isValid]);

    useEffect(() => {
        if (prepareTx && prepareTx?.data && sendTransaction) {
            sendTransaction?.();
        }
    }, [prepareTx, sendTransaction]);

    useEffect(() => {
        if (isTxSuccess) {
            bridgeEstimate.transactions = bridgeEstimate.transactions.map((x) => {
                if (x.clientId === prepareTx.clientId) {
                    x.isSigned = true;
                }
                return {
                    ...x,
                };
            });
            setBridgeEstimate(bridgeEstimate);
            signTransaction();
        }
    }, [isTxSuccess]);

    const fetchNFTs = async () => {
        try {
            const res = await getAllNFTs();
            const nftRes = res.nfts.map((collection) => {
                return {
                    baseUri: collection.baseUri,
                    name: collection.name,
                    ticker: collection.symbol,
                    networks: collection.networks,
                    owner: collection.owner,
                    imageUrl: collection.imageUrl,
                    tokenMintChainId: collection.tokenMintChainId
                };
            });
            setNfts(nftRes);
        } catch (err) {
            console.log(err);
            setNfts([]);
        }
    };

    const fetchEstimates = async () => {
        try {
            if (isValid) {
                setIsFetchEstimates(true);
                const res: BridgeEstimateResponse = await getNFTBridgeEstimates(
                    selectedFromChain.value,
                    selectedFromChain?.genericTokenAddress || selectedFromChain.address,
                    selectedToChain.value,
                    selectedToChain.address,
                    address,
                    address,
                    nftId.toString()
                );

                res.transactions = res.transactions.map((x) => {
                    return {
                        ...x,
                        isSigned: false,
                        clientId: `CAT-${Math.random()}`,
                    };
                });
                setBridgeEstimate(res);
                setIsFetchEstimates(false);
            }
        } catch (error) {
            setBridgeEstimate(undefined);
            setIsFetchEstimates(false);
        }
    };

    const signTransaction = async () => {
        if (chain?.id !== selectedFromChain.value) {
            const network = await switchNetworkAsync(selectedFromChain.value)
                .then((res) => {
                    sendTx();
                })
                .catch((err) => {
                    console.log("Error while changing network");
                });
        } else {
            sendTx();
        }
    };

    const sendTx = async () => {
        if (isValid) {
            const tx = bridgeEstimate.transactions.find((x) => x.isSigned === false);
            if (tx) {
                const increasedFee = increaseGasFee(gasFee?.gasPrice, 10)
                tx.gasFee = increasedFee
                setPrepareTx(tx);
            } else {
                setPrepareTx(null);
                history.push(`/bridge/status?nft=${bridgeEstimate?.id}`);
            }
        } else {
            toast.error(`Your token balance is low.`, {
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

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const openModal = () => {
        if (isConnected) {
            setModalIsOpen(true)
            setNftId(null)
        } else {
            toast.error(`Please connect your wallet.`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
            });
        }
    }

    return (
        <MainContainer>
            <InnerSection>
                {<NFTmodal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} setNftId={setNftId} nfts={nfts} setSelectedChainNetworks={setSelectedChainNetworks} />}
                <Flex justifyContent={"space-around"}>
                    <Text
                        fontFamily={theme.fonts.primary}
                        fontWeight={theme.fonts.semiBold}
                        fontSize={"32px"}
                    >
                        Bridge
                    </Text>
                </Flex>
                <Flex justifyContent={"space-around"} mt={"21px"}>
                    <Text
                        fontFamily={theme.fonts.primary}
                        fontStyle={"normal"}
                        fontWeight={theme.fonts.light}
                        fontSize={"14px"}
                    >
                        Migrate your NFT across chains
                    </Text>
                </Flex>
                <Flex mt={"10px"}>
                    <Flex flexDirection={"column"} width={"100%"} mt={"20px"}>
                        <NFTinput
                            onClick={() => openModal()}
                        >
                            <Flex ml={'5px'}>
                                {nftId ? `NFT ID: ${nftId}` : 'Select NFT'}
                            </Flex>
                        </NFTinput>
                    </Flex>
                </Flex>
                <Flex flexWrap={"wrap"}>
                    <Flex mt={"10px"} width={"50%"} flexDirection={"column"}>
                        <Flex mt={"16px"} ml={"12px"} mb={"8px"}>
                            <Text
                                fontFamily={theme.fonts.primary}
                                fontWeight={theme.fonts.light}
                                fontSize={"14px"}
                            >
                                From
                            </Text>
                        </Flex>
                        <Flex width={"90%"}>
                            <Select
                                isClearable
                                className="select-main-container"
                                name="form-field-name"
                                placeholder={"Select"}
                                options={supportedBlockChains.filter(
                                    (x) => x.value !== selectedToChain?.value
                                )}
                                value={selectedFromChain}
                                onChange={(choice) => setSelectedFromChain(choice)}
                                components={{
                                    Option: IconOption,
                                    SingleValue,
                                    IndicatorSeparator: () => null,
                                }}
                                styles={inputStyles}
                            />
                        </Flex>
                    </Flex>

                    <Flex mt={"10px"} width={"50%"} flexDirection={"column"}>
                        <Flex mt={"16px"} ml={"10px"} mb={"8px"}>
                            <Text
                                fontFamily={theme.fonts.primary}
                                fontWeight={theme.fonts.light}
                                fontSize={"14px"}
                            >
                                To
                            </Text>
                        </Flex>
                        <Flex>
                            <Select
                                isClearable
                                className="select-main-container"
                                name="form-field-name"
                                options={supportedBlockChains.filter(
                                    (x) => x.value !== selectedFromChain?.value
                                )}
                                placeholder={"Select"}
                                value={selectedToChain}
                                onChange={(choice) => setSelectedToChain(choice)}
                                components={{
                                    Option: IconOption,
                                    SingleValue,
                                    IndicatorSeparator: () => null,
                                }}
                                styles={inputStyles}
                            />
                        </Flex>
                    </Flex>
                </Flex>
                <Flex flexWrap={"wrap"}>
                    <Flex mt={"10px"} width={"100%"} flexDirection={"column"}>
                        <Flex
                            mt={"16px"}
                            mb={"0px"}
                            justifyContent={"space-between"}
                        >
                            <Text
                                fontFamily={theme.fonts.primary}
                                fontWeight={theme.fonts.light}
                                color={theme.colors.text}
                                fontSize={"14px"}
                            >
                                Required Balance:
                            </Text>
                            <Text
                                fontFamily={theme.fonts.primary}
                                fontWeight={theme.fonts.light}
                                fontSize={"14px"}
                                color={
                                    isValid
                                        ? parseFloat(balanceData?.formatted) >
                                            parseFloat(
                                                bridgeEstimate?.totalGasFeeInTokenSourceChain.toFixed(2)
                                            )
                                            ? theme.colors.success
                                            : theme.colors.failure
                                        : theme.colors.textDisabled
                                }
                            >
                                {isConnected && isFetchEstimates ? (
                                    <Spinner radius={8} />
                                ) : isConnected &&
                                    isValid &&
                                    bridgeEstimate?.totalGasFeeInTokenSourceChain ? (
                                    `${bridgeEstimate.totalGasFeeInTokenSourceChain.toFixed(2)} ${balanceData.symbol
                                    }`
                                ) : (
                                    "-"
                                )}
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex mt={"8px"} width={"100%"} flexDirection={"column"}>
                        <Flex
                            mt={"16px"}
                            mb={"0px"}
                            justifyContent={"space-between"}
                        >
                            <Text
                                fontFamily={theme.fonts.primary}
                                fontWeight={theme.fonts.light}
                                color={theme.colors.text}
                                fontSize={"14px"}
                            >
                                Available Balance:
                            </Text>
                            <Text
                                fontFamily={theme.fonts.primary}
                                fontWeight={theme.fonts.light}
                                color={theme.colors.textDisabled}
                                fontSize={"14px"}
                            >
                                {isConnected && isFetchEstimates ? (
                                    <Spinner radius={8} />
                                ) : isConnected && balanceData?.formatted ? (
                                    `${parseFloat(balanceData?.formatted).toFixed(2)} ${balanceData.symbol
                                    }`
                                ) : (
                                    "-"
                                )}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex justifyContent={"space-around"} mt={"21px"}>
                    <Box width={'100%'}>
                        <Button
                            height={"44px"}
                            width={"478px"}
                            type={"button"}
                            variant={"tertiary"}
                            onClick={signTransaction}
                            disabled={
                                parseFloat(balanceData?.formatted) <
                                parseFloat(
                                    bridgeEstimate?.totalGasFeeInTokenSourceChain.toFixed(2)
                                ) ||
                                bridgeEstimate?.totalGasFeeInTokenSourceChain === undefined ||
                                isValid === false ||
                                isLoading ||
                                isWaitLoading
                            }
                            isLoading={isLoading || isWaitLoading}
                        >
                            <Flex justifyContent={"center"}>
                                <Text
                                    fontWeight={theme.fonts.semiBold}
                                    fontSize={"14px"}
                                    ml={"6px"}
                                >
                                    {isLoading || isWaitLoading ? (
                                        <Spinner radius={8} />
                                    ) : (
                                        "Migrate"
                                    )}
                                </Text>
                            </Flex>
                        </Button>
                    </Box>
                </Flex>
            </InnerSection>
        </MainContainer>
    );
};

export default BridgeNFT;
