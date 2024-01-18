import { Box, Flex } from "components/Box";
import { InnerSection } from "../DeployTokens/styles";
import { Text } from "components/Text";
import { Link, useHistory } from "react-router-dom";
import Button from "components/Button";
import useTheme from "components/hooks/useTheme";
import { EstimateResponse } from "config/types";
import {
    useAccount,
    useBalance,
    useNetwork,
    usePrepareSendTransaction,
    useSendTransaction,
    useSwitchNetwork,
} from "wagmi";
import { useEffect } from "react";
import { switchNetwork } from "@wagmi/core";
import Spinner from "components/SpinnerCircle";
import { handleDecimals } from "utils";

interface IProp {
    deployEstimate: EstimateResponse;
    isFetchEstimates: boolean;
    isFieldValidate: any;
    existingTokenError: boolean;
}

const DetailCard: React.FC<IProp> = ({
    deployEstimate,
    isFetchEstimates,
    isFieldValidate,
    existingTokenError,
}) => {
    const { theme } = useTheme();
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();

    const history = useHistory();
    const { data } = useBalance({
        address,
        chainId: deployEstimate?.chainId,
    });

    const { config } = usePrepareSendTransaction({
        request: {
            to: deployEstimate?.transaction?.to,
            value: deployEstimate?.transaction.value,
            data: deployEstimate?.transaction.data,
            gasPrice: deployEstimate?.gasFee,
        },
    });
    const { isSuccess, sendTransaction } = useSendTransaction(config);

    useEffect(() => {
        if (isSuccess) {
            history.push(`/details?flow=nft&salt=${deployEstimate?.salt}`);
        }
    }, [isSuccess]);

    const checkAndSendTransaction = async () => {
        if (chain.id !== deployEstimate?.chainId) {
            const network = await switchNetworkAsync(deployEstimate?.chainId)
                .then((res) => {
                    sendTransaction?.();
                })
                .catch((err) => {
                    console.log("Error while changing network");
                });
        } else {
            sendTransaction?.();
        }
    };

    return (
        <Flex mt={"73px"} ml={'10px'}>
            <InnerSection>
                <Flex flexDirection={"column"}>
                    <Flex>
                        <Text
                            fontFamily={theme.fonts.primary}
                            fontWeight={theme.fonts.medium}
                            fontSize={"20px"}
                        >
                            Enter details and deploy
                        </Text>
                    </Flex>
                    <Flex mt={"20px"} justifyContent={"space-between"}>
                        <Text
                            fontFamily={theme.fonts.primary}
                            fontWeight={theme.fonts.light}
                            fontSize={"14px"}
                        >
                            Required balance:
                        </Text>
                        <Text
                            fontFamily={theme.fonts.primary}
                            fontWeight={theme.fonts.light}
                            fontSize={"14px"}
                            color={
                                deployEstimate?.totalGasFeeInTokenMintingChain ?
                                    isFieldValidate() &&
                                    existingTokenError === false &&
                                    (deployEstimate?.totalGasFeeInTokenMintingChain <=
                                        +data?.formatted
                                        ? theme.colors.success
                                        : theme.colors.error)
                                    : theme.colors.textDisabled
                            }
                        >
                            {isFetchEstimates ? (
                                <Spinner radius={8} />
                            ) : deployEstimate?.totalGasFeeInTokenMintingChain &&
                                isFieldValidate() &&
                                existingTokenError === false &&
                                data?.symbol
                                ? (
                                    `${handleDecimals(deployEstimate?.totalGasFeeInTokenMintingChain)} ${data?.symbol
                                    }`
                                ) : (
                                    "-"
                                )}
                        </Text>
                    </Flex>
                    <Flex mt={"10px"} justifyContent={"space-between"}>
                        <Text
                            fontFamily={theme.fonts.primary}
                            fontWeight={theme.fonts.light}
                            fontSize={"14px"}
                        >
                            Available balance:
                        </Text>
                        <Text
                            fontFamily={theme.fonts.primary}
                            fontWeight={theme.fonts.light}
                            color={theme.colors.textDisabled}
                            fontSize={"14px"}
                        >
                            {isFetchEstimates ? (
                                <Spinner radius={8} />
                            ) : data?.formatted ? (
                                `${handleDecimals(+data?.formatted)} ${data?.symbol}`
                            ) : (
                                "-"
                            )}
                        </Text>
                    </Flex>
                    <Flex justifyContent={"space-around"} mt={"45px"}>
                        <Box>
                            <Button
                                disabled={
                                    parseFloat(data?.formatted) <
                                    deployEstimate?.totalGasFeeInTokenMintingChain
                                    ||
                                    deployEstimate?.totalGasFeeInTokenMintingChain ===
                                    undefined ||
                                    !isFieldValidate() ||
                                    isFetchEstimates ||
                                    existingTokenError
                                }
                                height={"44px"}
                                width={"306px"}
                                type={"submit"}
                                variant={"tertiary"}
                                onClick={checkAndSendTransaction}
                            >
                                <Flex justifyContent={"center"}>
                                    <Text
                                        fontWeight={theme.fonts.semiBold}
                                        fontSize={"14px"}
                                        ml={"6px"}
                                    >
                                        Deploy
                                    </Text>
                                </Flex>
                            </Button>
                        </Box>
                    </Flex>
                </Flex>
            </InnerSection>
        </Flex>
    );
};

export default DetailCard;
