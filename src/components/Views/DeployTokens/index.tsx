import useTheme from "components/hooks/useTheme";
import { Text } from "components/Text";
import { Box, Flex } from "components/Box";
import {
  ChianCol,
  InnerSection,
  Input,
  MainContainer,
  Switch,
  SwitchToggle,
} from "./styles";
import { useEffect, useState } from "react";
import { ChainArray, inputStyles } from "config/constants";
import Select, { components } from "react-select";
import { useLocation } from "react-router-dom";
import DetailCard from "./DetailCard";
import { getDeployEstimates, getTokenInfo } from "services/token.service";
import { useAccount, useFeeData, useNetwork } from "wagmi";
import {
  CATType,
  EstimateResponse,
  IChainOption,
  TokenInfoResponse,
} from "config/types";
import { toast } from "react-toastify";
import { increaseGasFee, noExponents } from "utils";

const DeployTokens = () => {
  const { theme } = useTheme();
  const { address: userWalletAddress, isConnected } = useAccount();
  const { chain } = useNetwork();

  const [multipleChains, setMultipleChains] = useState(() =>
    ChainArray.map((item) => ({
      ...item,
      isChecked: false,
      isHomeChain: false,
      isAlreadyDeployed: false,
    }))
  );

  const [isFetchEstimates, setIsFetchEstimates] = useState<boolean>(false);
  const [homeChain, setHomeChain] = useState<IChainOption>(null);
  const [tokenName, setTokenName] = useState<string | undefined>(undefined);
  const [tokenTicker, setTokenTicker] = useState<string | undefined>(undefined);
  const [tokenDecimals, setTokenDecimals] = useState<string | undefined>(
    undefined
  );
  const [tokenSupply, setTokenSupply] = useState<string | undefined>(undefined);
  const [tokenAdress, setTokenAdress] = useState<string | undefined>(undefined);
  const [isError, setIsError] = useState(false);
  const [deployEstimates, setDeployEstimates] =
    useState<EstimateResponse>(null);
  const [tokenSalt, setTokenSalt] = useState<string>("");
  const { data: gasFee } = useFeeData({chainId: homeChain?.value})

  const location = useLocation();
  const newToken: string = new URLSearchParams(location.search).get("newToken");
  const [catType, setCatType] = useState<string>(
    newToken === "true" ? CATType.CATType : ""
  );
  const options: Array<IChainOption> = ChainArray.map((item) => {
    return { value: item.chainId, label: item.name, icon: item.icon };
  });

  const { Option } = components;
  const IconOption = (props) => (
    <Option className="chain-options" {...props}>
      <Box className="svg-icon" mr={"5px"}>
        {props.data.icon}
      </Box>
      {props.data.label}
    </Option>
  );

  const SingleValue = (props) => (
    <Flex alignItems={"center"}>
      <Box className="select-svg-icon" mt={"5px"} mr={"5px"}>
        {props.data.icon}
      </Box>
      {props.data.label}
    </Flex>
  );

  useEffect(() => {
    if (multipleChains.length > 0 && tokenDecimals && tokenSupply) {
      fetchDeployEstimates();
    }
  }, [multipleChains, tokenDecimals, tokenSupply]);

  useEffect(() => {
    if (chain?.id) {
      const selectedOpt = options.find((x) => x.value === chain?.id);
      if (selectedOpt) setChain(selectedOpt);
    }
  }, [chain]);

  useEffect(() => {
    if (newToken === "false" && tokenAdress && homeChain?.value != null) {
      fetchTokenInfo();
    }
  }, [newToken, tokenAdress, homeChain]);

  const setTokenSupplyInWei = (
    tknSupply: string,
    tknDecimal: string,
    isCallFromSupply: boolean
  ) => {
    const decimals = parseFloat(tknDecimal);
    if (tknSupply) {
      const supply = noExponents(
        Math.floor(+tknSupply * Math.pow(10, decimals)).toString()
      );
      setTokenSupply(supply);
    } else if (isCallFromSupply) {
      setTokenSupply("");
    }
  };

  const isFieldValidate = () => {
    if (
      isConnected &&
      homeChain !== null &&
      multipleChains.length > 0 &&
      multipleChains.filter((item) => !item.isAlreadyDeployed && item.isChecked)
        .length > 0 &&
      tokenName &&
      tokenTicker &&
      tokenDecimals &&
      (newToken == 'true' ? +tokenSupply > 0 : tokenSupply)
    ) {
      return true;
    }
    setDeployEstimates(null);
    return false;
  };

  const [apiQueue, setApiQueue] = useState([]);
  const [existingTokenError, setExistingTokenError] = useState(false);

  const enqueueApiCall = async (request) => {
    setApiQueue((prevQueue) => [...prevQueue, request]);
  };

  const processApiQueue = async () => {
    if (isFetchEstimates || apiQueue.length === 0) return;

    const apiRequest = apiQueue[0];
    setIsFetchEstimates(true);
    try {
      const res: EstimateResponse = await apiRequest(
        tokenName,
        tokenTicker,
        parseFloat(tokenDecimals),
        tokenSupply,
        filteredChains,
        homeChain,
        userWalletAddress,
        catType,
        tokenSalt,
        tokenAdress
      );
      res.gasFee = increaseGasFee(gasFee?.gasPrice, 10)
      setTokenSalt(res?.salt);
      setDeployEstimates(res);

      setApiQueue((prevQueue) => prevQueue.slice(1));
    } catch (error) {
      console.error("Error occurred while making API call:", error);
      setDeployEstimates(null);
    }
    setIsFetchEstimates(false);
  };

  useEffect(() => {
    processApiQueue();
  }, [apiQueue]);

  const [filteredChains, setFilteredChains] = useState([]);
  const fetchDeployEstimates = async () => {
    if (isFieldValidate()) {
      const chainStringMapping = multipleChains
        .filter((x) => x.isChecked === true && x.isAlreadyDeployed === false)
        .map((item) => {
          return item.chainId.toString();
        });

      if (chainStringMapping.length > 0) {
        setFilteredChains(chainStringMapping);
        enqueueApiCall(getDeployEstimates);
      }
    }
  };

  const setChain = (item) => {
    setHomeChain(item);
    const hasHomeChain = multipleChains.find((x) => x.isHomeChain === true);
    if (hasHomeChain) {
      hasHomeChain.isChecked = false;
      hasHomeChain.isHomeChain = false;
    }

    const selectedChain = multipleChains.find((x) => x.chainId === item?.value);
    selectedChain.isChecked = true;
    selectedChain.isHomeChain = true;

    setMultipleChains((prev) => [...multipleChains]);
  };

  const fetchTokenInfo = async () => {
    try {
      const res: TokenInfoResponse = await getTokenInfo(
        homeChain.value,
        tokenAdress
      );
      const { tokenInfo, type } = res;
      setTokenName(tokenInfo.name);
      if (newToken === "true") {
        setCatType(CATType.CATType);
      } else {
        setCatType(type);
      }
      setTokenDecimals(tokenInfo.decimals.toString());
      setTokenSupply("0");
      setTokenTicker(tokenInfo.symbol);
      setTokenSalt(tokenInfo?.salt);
      const chains = multipleChains.map((chain) => {
        chain.isAlreadyDeployed = false;
        if (res.deployedNetworks.includes(chain.chainId)) {
          chain.isAlreadyDeployed = true;
          chain.isChecked = true;
        }
        return chain;
      });

      setExistingTokenError(false);
      setMultipleChains(chains);
    } catch (error) {
      setExistingTokenError(true);
      toast.error("Address not found on chain.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  const handleTokenAddress = (e) => {
    const ETHregex = /^0x[a-fA-F0-9]{40}$/g;
    if (ETHregex.test(e.target.value) || e.target.value === "") {
      setTokenAdress(e.target.value);
      setIsError(false);
    } else {
      setIsError(true);
    }
  };

  return (
    <MainContainer>
      <Flex flexDirection={"row"}>
        <Flex flexDirection={"column"} width={"75%"}>
          <Flex mt={"30px"}>
            <Text
              fontFamily={theme.fonts.primary}
              fontWeight={theme.fonts.semiBold}
              fontSize={"32px"}
              lineHeight={"45px"}
            >
              {newToken === "true"
                ? "Deploy new token"
                : "Deploy existing token"}
            </Text>
          </Flex>

          <Flex mt={"48px"} flexDirection={"column"}>
            <Text
              fontFamily={theme.fonts.primary}
              fontWeight={theme.fonts.medium}
              fontSize={"16px"}
            >
              Blockchains
            </Text>
            <Flex mt={"16px"} ml={"14px"} mb={"8px"}>
              <Text
                fontFamily={theme.fonts.primary}
                fontWeight={theme.fonts.light}
                fontSize={"14px"}
              >
                Select home chain
              </Text>
            </Flex>
            <Flex>
              <Select
                required={true}
                className="select-main-container"
                name="homeChain"
                placeholder={"Select"}
                value={homeChain}
                options={options}
                onChange={(item: any) => {
                  setChain(item);
                }}
                components={{
                  SingleValue,
                  Option: IconOption,
                  IndicatorSeparator: () => null,
                }}
                styles={inputStyles}
              />
            </Flex>
          </Flex>
          {newToken === "true" && (
            <Flex mt={"32px"} flexDirection={"column"}>
              <Text
                fontFamily={theme.fonts.primary}
                fontWeight={theme.fonts.medium}
                fontSize={"16px"}
              >
                Token information
              </Text>
              <Flex flexWrap={"wrap"}>
                <Flex flexDirection={"column"} width={"48%"} pr={"24px"}>
                  <Text
                    mt={"16px"}
                    ml={"15px"}
                    mb={"8px"}
                    fontFamily={theme.fonts.primary}
                    fontWeight={theme.fonts.light}
                    fontSize={"14px"}
                  >
                    Token name
                  </Text>
                  <Flex flexDirection={"column"}>
                    <Input
                      type="text"
                      padding={"0px 17px 0px 15px"}
                      placeholder="Token name"
                      className={tokenName === "" && "border-color"}
                      onBlur={(e) => {
                        setTokenName(e.target.value);
                      }}
                    />
                    {/* {tokenName === "" && (
                      <Text
                        fontFamily={theme.fonts.primary}
                        fontWeight={theme.fonts.light}
                        fontSize={"12px"}
                        color={theme.colors.error}
                      >
                        Invalid value
                      </Text>
                    )} */}
                  </Flex>
                </Flex>
                <Flex flexDirection={"column"} width={"48%"}>
                  <Text
                    mt={"16px"}
                    ml={"15px"}
                    mb={"8px"}
                    fontFamily={theme.fonts.primary}
                    fontWeight={theme.fonts.light}
                    fontSize={"14px"}
                  >
                    Token ticker
                  </Text>
                  <Input
                    type="text"
                    padding={"0px 17px 0px 15px"}
                    placeholder="Token ticker"
                    className={tokenTicker === "" && "border-color"}
                    onBlur={(e) => {
                      setTokenTicker(e.target.value);
                    }}
                  />
                </Flex>
                <Flex flexDirection={"column"} width={"48%"} pr={"24px"}>
                  <Text
                    mt={"16px"}
                    ml={"15px"}
                    mb={"8px"}
                    fontFamily={theme.fonts.primary}
                    fontWeight={theme.fonts.light}
                    fontSize={"14px"}
                  >
                    Token decimals
                  </Text>
                  <Input
                    type="number"
                    onWheel={(event) => event.currentTarget.blur()}
                    padding={"0px 17px 0px 15px"}
                    placeholder="Enter value"
                    className={tokenDecimals === "" && "border-color"}
                    onBlur={(e) => {
                      setTokenDecimals(e.target.value);
                      setTokenSupplyInWei(tokenSupply, e.target.value, false);
                    }}
                  />
                </Flex>
                <Flex flexDirection={"column"} width={"48%"}>
                  <Text
                    mt={"16px"}
                    ml={"15px"}
                    mb={"8px"}
                    fontFamily={theme.fonts.primary}
                    fontWeight={theme.fonts.light}
                    fontSize={"14px"}
                  >
                    Token supply
                  </Text>
                  <Input
                    type="number"
                    onWheel={(event) => event.currentTarget.blur()}
                    padding={"0px 17px 0px 15px"}
                    placeholder="Enter amount"
                    className={tokenSupply === "" && "border-color"}
                    onBlur={(e) =>
                      setTokenSupplyInWei(e.target.value, tokenDecimals, true)
                    }
                  />
                </Flex>
              </Flex>
            </Flex>
          )}
          {newToken === "false" && (
            <Flex flexDirection={"column"} mt={"32px"} pr={"20px"}>
              <Text
                fontFamily={theme.fonts.primary}
                fontWeight={theme.fonts.medium}
                fontSize={"16px"}
              >
                Token information
              </Text>
              <Text
                mt={"16px"}
                ml={"15px"}
                mb={"8px"}
                fontFamily={theme.fonts.primary}
                fontWeight={theme.fonts.light}
                fontSize={"14px"}
              >
                Token address
              </Text>
              <Input
                type="text"
                padding={"0px 17px 0px 15px"}
                placeholder="Token address"
                className={isError && "border-color"}
                onChange={(e) => {
                  handleTokenAddress(e);
                }}
              />
            </Flex>
          )}
          <Flex mt={"32px"} flexDirection={"column"} mb={"28px"}>
            <Text
              fontFamily={theme.fonts.primary}
              fontWeight={theme.fonts.medium}
              fontSize={"16px"}
            >
              Select additional chains{" "}
            </Text>
            <Flex flexWrap={"wrap"} flexDirection={"row"} mt={"28px"}>
              {multipleChains &&
                multipleChains.map((chain, index) => {
                  return (
                    <ChianCol
                      key={index}
                      style={{ opacity: chain.isAlreadyDeployed ? 0.6 : 1 }}
                    >
                      <Flex alignItems={"center"}>
                        {chain?.icon}
                        <Text fontFamily={theme.fonts.primary}>
                          {chain.name}
                        </Text>
                      </Flex>
                      <Flex alignItems={"center"}>
                        {chain.isHomeChain && (
                          <Text
                            fontFamily={theme.fonts.primary}
                            fontSize={"10px"}
                          >
                            HOME CHAIN
                          </Text>
                        )}
                        <Box>
                          <Switch
                            isDisabled={
                              chain.isAlreadyDeployed || chain.isHomeChain
                            }
                            isChecked={chain.isChecked}
                            onKeyPress={() => {
                              if (
                                chain.isAlreadyDeployed === false &&
                                chain.isHomeChain === false
                              ) {
                                multipleChains[index].isChecked =
                                  !chain.isChecked;
                                setMultipleChains((item) => [
                                  ...multipleChains,
                                ]);
                              }
                            }}
                            onClick={() => {
                              if (
                                chain.isAlreadyDeployed === false &&
                                chain.isHomeChain === false
                              ) {
                                multipleChains[index].isChecked =
                                  !chain.isChecked;
                                setMultipleChains((item) => [
                                  ...multipleChains,
                                ]);
                              }
                            }}
                          >
                            <SwitchToggle state={!chain.isChecked} />
                            <SwitchToggle state={chain.isChecked} />
                          </Switch>
                        </Box>
                      </Flex>
                    </ChianCol>
                  );
                })}
            </Flex>
          </Flex>
        </Flex>
        <DetailCard
          deployEstimate={deployEstimates}
          isFetchEstimates={isFetchEstimates}
          isFieldValidate={isFieldValidate}
          existingTokenError={existingTokenError}
        />
      </Flex>
    </MainContainer>
  );
};

export default DeployTokens;
