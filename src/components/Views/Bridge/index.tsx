import { Box, Flex } from "components/Box";
import Button from "components/Button";
import Spinner from "components/SpinnerCircle";
import { Text } from "components/Text";
import { ChainArray, inputStyles } from "config/constants";
import {
  BridgeEstimateResponse,
  BridgeTokenResponse,
  BridgeTransaction,
} from "config/types";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { getAllTokens, getBridgeEstimates } from "services/token.service";
import { noExponents, handleDecimals, increaseGasFee } from "utils";
import {
  useAccount,
  useBalance,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useSwitchNetwork,
  useWaitForTransaction,
  useFeeData,
} from "wagmi";
import useTheme from "../../hooks/useTheme";
import { Input } from "../DeployTokens/styles";
import { InnerSection, MainContainer } from "./styles";

type SelectOptions = {
  label: string;
  value: number;
  icon: any;
  address: `0x${string}`;
  genericTokenAddress: `0x${string}`;
};

const Bridge = () => {
  const { theme } = useTheme();
  const history = useHistory();
  const [supportedBlockChains, setSupportedBlockChains] = useState<
    Array<SelectOptions>
  >([]);
  const [amount, setAmount] = useState<string>();
  const [selectedToken, setSelectedToken] = useState<BridgeTokenResponse>();
  const [selectedToChain, setSelectedToChain] = useState<SelectOptions>();
  const [selectedFromChain, setSelectedFromChain] = useState<SelectOptions>();
  const [tokens, setTokens] = useState<Array<BridgeTokenResponse>>([]);
  const [isFetchEstimates, setIsFetchEstimates] = useState<boolean>(false);

  const { Option } = components;
  const IconOption = (props) => (
    <Option className="chain-options" {...props}>
      <Box className="svg-icon" mr={'5px'}>{props.data.icon}</Box>
      {props.data.label}
    </Option>
  );

  const SingleValue = (props) => (
    <Flex alignItems={"center"}>
      <Box className="select-svg-icon" mt={"7px"} mr={'5px'}>
        {props.data.icon}
      </Box>
      {props.data.label}
    </Flex>
  );

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { data: gasFee } = useFeeData({chainId: selectedFromChain?.value})
  const [isChainChanged, setIsChainChanged] = useState<boolean>(false)

  const { data: balanceData } = useBalance({
    address,
    chainId: selectedFromChain?.value,
  });

  const { data: transferChainBalanceData, isLoading: isBalanceLoading } =
    useBalance({
      address,
      chainId: selectedFromChain?.value,
      token:
        selectedFromChain?.genericTokenAddress || selectedFromChain?.address,
    });

  const isValid: boolean =
    isConnected &&
      selectedToken?.decimals &&
      selectedFromChain &&
      selectedToChain &&
      amount
      ? true
      : false;

  const [bridgeEstimate, setBridgeEstimate] =
    useState<BridgeEstimateResponse>();

  const [prepareTx, setPrepareTx] = useState<BridgeTransaction>(null);

  const { config } = usePrepareSendTransaction({
    request: {
      to: prepareTx?.to,
      value: prepareTx?.value,
      data: prepareTx?.data,
      gasPrice: prepareTx?.gasFee,
    }
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
    if (isChainChanged === true && chain?.id === selectedFromChain.value) {
      sendTx()
      setIsChainChanged(false)
    }
  }, [isChainChanged, chain])

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    if (selectedToken?.networks) {
      const availableChains = selectedToken.networks.map((x) => {
        return {
          chainId: x.chainId,
          address: x.address,
          genericTokenAddress: x?.genericTokenAddress,
        };
      });
      const selectedTokenChains = [];
      ChainArray.forEach((item) => {
        for (let chain of availableChains) {
          if (chain.chainId === item.chainId) {
            selectedTokenChains.push({
              value: item.chainId,
              label: item.name,
              icon: item.icon,
              address: chain.address,
              genericTokenAddress: chain.genericTokenAddress,
            });
          }
        }
        return selectedTokenChains;
      });
      setSelectedFromChain(null);
      setSelectedToChain(null);
      setSupportedBlockChains(selectedTokenChains);
    }
  }, [selectedToken]);

  useEffect(() => {
    fetchEstimates();
  }, [isConnected, selectedFromChain, selectedToChain, amount]);

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

  const fetchTokens = async () => {
    try {
      const res = await getAllTokens();
      const tokenRes = res.tokens.map((token) => {
        return {
          value: token.salt,
          label: token.symbol,
          networks: token.networks,
          owner: token.owner,
          decimals: token.decimals,
        };
      });
      setTokens(tokenRes);
    } catch (err) {
      console.log(err);
      setTokens([]);
    }
  };

  const fetchEstimates = async () => {
    try {
      if (isValid) {
        setIsFetchEstimates(true);
        const amountInWei = noExponents(
          Math.floor(+amount * Math.pow(10, selectedToken.decimals)).toString()
        );
        const res: BridgeEstimateResponse = await getBridgeEstimates(
          selectedFromChain.value,
          selectedFromChain?.genericTokenAddress || selectedFromChain.address,
          selectedToChain.value,
          selectedToChain.address,
          address,
          address,
          amountInWei
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
    if (isValid && +transferChainBalanceData.formatted >= +amount) {
      if (chain?.id !== selectedFromChain.value) {
        await switchNetworkAsync(selectedFromChain.value)
          .then((res) => {
            setIsChainChanged(true)
          })
          .catch((err) => {
            setIsChainChanged(false)
            console.log("Error while changing network");
          });
      } else {
        sendTx();
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

  const sendTx = async () => {
    const tx = bridgeEstimate.transactions.find((x) => x.isSigned === false);
    if (tx) {
      const increasedFee = increaseGasFee(gasFee?.gasPrice, 10)
      tx.gasFee = increasedFee
      setPrepareTx(tx);
    } else {
      setPrepareTx(null);
      history.push(`/bridge/status?token=${bridgeEstimate?.id}`);
    }
  };

  return (
    <MainContainer>
      <InnerSection>
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
            Migrate your tokens across chains
          </Text>
        </Flex>
        <Flex mt={"10px"}>
          <Flex flexDirection={"column"} width={"100%"} mt={"20px"}>
            <Select
              className="select-main-container"
              name="form-field-name"
              placeholder={"Select token"}
              options={tokens}
              onChange={(choice) => setSelectedToken(choice)}
              components={{
                Option: IconOption,
                SingleValue,
                IndicatorSeparator: () => null,
              }}
              styles={inputStyles}
            />
          </Flex>
        </Flex>
        <Flex flexWrap={"wrap"}>
          <Flex mt={"10px"} width={"50%"} flexDirection={"column"}>
            <Flex mt={"16px"} ml={"10px"} mb={"8px"}>
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
        <Flex mt={"10px"}>
          <Flex flexDirection={"column"} width={"100%"}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Text
                mt={"16px"}
                ml={"10px"}
                mb={"10px"}
                fontFamily={theme.fonts.primary}
                fontWeight={theme.fonts.light}
                fontSize={"14px"}
              >
                Token amount
              </Text>

              {isBalanceLoading && (
                <Flex mt={"15px"} mr={"10px"}>
                  <Spinner radius={7} />
                </Flex>
              )}
              {selectedFromChain?.address &&
                transferChainBalanceData?.formatted && (
                  <Text
                    fontFamily={theme.fonts.primary}
                    fontWeight={theme.fonts.light}
                    color={theme.colors.textDisabled}
                    fontSize={"11px"}
                    mt={"25px"}
                  >
                    {`Available: ${+parseFloat(
                      transferChainBalanceData?.formatted
                    ).toFixed(2)} tokens`}
                  </Text>
                )}
            </Flex>
            <Input
              type="number"
              onWheel={(event) => event.currentTarget.blur()}
              padding={"0px 17px"}
              className="token-amount"
              placeholder="Enter token amount"
              onChange={(e) => {
                setTimeout(() => {
                  setAmount(e.target.value);
                }, 800);
              }}
            />
          </Flex>
        </Flex>
        <Flex flexWrap={"wrap"}>
          <Flex mt={"10px"} width={"100%"} flexDirection={"column"}>
            <Flex mt={"16px"} mb={"0px"} justifyContent={"space-between"}>
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
                  isValid
                    ? parseFloat(balanceData?.formatted) >
                      bridgeEstimate?.totalGasFeeInTokenSourceChain
                      ? theme.colors.success
                      : theme.colors.failure
                    : ""
                }
              >
                {isConnected && isFetchEstimates ? (
                  <Spinner radius={8} />
                ) : isConnected &&
                  isValid &&
                  bridgeEstimate?.totalGasFeeInTokenSourceChain ? (
                  `${handleDecimals(
                    bridgeEstimate?.totalGasFeeInTokenSourceChain
                  )} ${balanceData?.symbol}`
                ) : (
                  "-"
                )}
              </Text>
            </Flex>
          </Flex>

          <Flex mt={"10px"} width={"100%"} flexDirection={"column"}>
            <Flex mt={"16px"} mb={"0px"} justifyContent={"space-between"}>
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
                {isConnected && isFetchEstimates ? (
                  <Spinner radius={8} />
                ) : isConnected && balanceData?.formatted ? (
                  `${handleDecimals(+balanceData?.formatted)} ${balanceData?.symbol
                  }`
                ) : (
                  "-"
                )}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex justifyContent={"space-around"} mt={"21px"}>
          <Box width={"100%"}>
            <Button
              height={"44px"}
              width={"478px"}
              type={"button"}
              variant={"tertiary"}
              onClick={signTransaction}
              disabled={
                parseFloat(balanceData?.formatted) <
                bridgeEstimate?.totalGasFeeInTokenSourceChain ||
                bridgeEstimate?.totalGasFeeInTokenSourceChain === undefined ||
                isValid === false ||
                isLoading ||
                isWaitLoading ||
                isFetchEstimates
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

export default Bridge;
