import { Box, Flex } from "components/Box";
import { InnerCard, Line, MainContainer, SideCard } from "./styles";
import { Text } from "components/Text";
import useTheme from "components/hooks/useTheme";
import TokenStatusCard from "./TokenStatusCard";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getDeployStatus } from "services/token.service";
import { NFTResponse, SaltResponse } from "config/types";
import useRefresh from "hooks/useRefresh";
import { fetchBalance, fetchToken } from "@wagmi/core";
import { useAccount } from "wagmi";
import SkeletonLoader from "components/SkeletonLoader";
import { DeployStatus } from "config/types";
import { getNFTDeployStatus } from "services/nft.service";
import NftStatusCard from "./NftStatusCard";

const TokenDetails = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const location = useLocation();
  const { tenSecondRefresh } = useRefresh();
  const [deployedOnAllChain, setDeployedOnAllChain] = useState<boolean>(true);
  const [tokenStatus, setTokenStatus] = useState<SaltResponse>({
    tokenInfo: {},
    tokenNetworks: [],
  });
  const [nftStatus, setNftStatus] = useState<NFTResponse>({
    nftInfo: {},
    nftNetworks: [],
  });
  let isDeployedOnAllChain: boolean;
  const [statusLoader, setStatusLoader] = useState<boolean>(false);
  const [statusInternalLoader, setStatusInternalLoader] =
    useState<boolean>(false);
  const salt: string = new URLSearchParams(location.search).get("salt");
  const flow: string = new URLSearchParams(location.search).get("flow");

  useEffect(() => {
    if (salt && address && deployedOnAllChain && flow === "token") {
      getTokenStatus();
    }
    if (salt && address && deployedOnAllChain && flow === "nft") {
      getNFTStatus();
    }
  }, [salt, tenSecondRefresh, address]);
  useEffect(() => {
    if (tokenStatus?.tokenNetworks.length > 0) {
      isDeployedOnAllChain = tokenStatus?.tokenNetworks?.some(
        (token) => token.status !== DeployStatus.DEPLOYED
      );
      setDeployedOnAllChain(isDeployedOnAllChain);
    }

    if (nftStatus?.nftNetworks.length > 0) {
      isDeployedOnAllChain = nftStatus?.nftNetworks?.some(
        (nft) => nft.status !== DeployStatus.DEPLOYED
      )
      setDeployedOnAllChain(isDeployedOnAllChain);
    }
  }, [tokenStatus, nftStatus]);

  const getTokenStatus = async () => {
    if (tokenStatus?.tokenNetworks.length === 0) {
      setStatusLoader(true);
    }
    try {
      setStatusInternalLoader(true);
      const res: SaltResponse = await getDeployStatus(salt);
      const networks = res.tokenNetworks;
      if (networks.length > 0) {
        try {
          for (let i = 0; i < networks.length; i++) {
            if (networks[i].address) {
              const supply = await fetchToken({
                chainId: networks[i].chainId,
                address: networks[i]?.genericTokenAddress
                  ? networks[i]?.genericTokenAddress
                  : networks[i].address,
              });
              res.tokenNetworks[i].supply = parseFloat(
                supply?.totalSupply.formatted
              ).toFixed(2);
            }
          }
        } catch (err) {
          console.log("Error fetching token supply.");
        }
      }
      setTokenStatus(res);
      setStatusLoader(false);
      setStatusInternalLoader(false);
    } catch (error) {
      console.log(error);
      setStatusLoader(false);
      setStatusInternalLoader(false);
    }
  };

  const getNFTStatus = async () => {
    if (nftStatus?.nftNetworks.length === 0) {
      setStatusLoader(true);
    }
    try {
      setStatusInternalLoader(true);
      const res: NFTResponse = await getNFTDeployStatus(salt);
      const networks = res.nftNetworks;
      setNftStatus(res);
      setStatusLoader(false);
      setStatusInternalLoader(false);
    } catch (error) {
      console.log(error);
      setStatusInternalLoader(false);
    }
  };

  return (
    <MainContainer>
      {statusLoader ? (
        <Flex flexDirection={"column"}>
          <Flex flexDirection={"row"} mt={"30px"}>
            <SkeletonLoader width={"150px"} height={"50px"} />
            <Flex pt={"5px"} alignItems={"flex-end"}>
              <SkeletonLoader
                width={"80px"}
                height={"25px"}
                styles={{ marginLeft: "10px" }}
              />
            </Flex>
          </Flex>
          <Flex
            flexDirection={"column"}
            justifyContent={"space-between"}
            mt={"60px"}
          >
            <Flex flexDirection={"row"}>
              <Flex flexDirection={"column"}>
                <SkeletonLoader width={"834px"} height={"200px"} />
              </Flex>
              <Flex ml={"20px"}>
                <SkeletonLoader width={"354px"} height={"129px"} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex flexDirection={"column"}>
          <Flex flexDirection={"row"} mt={"30px"}>
            <Text
              fontFamily={theme.fonts.primary}
              fontWeight={theme.fonts.semiBold}
              fontSize={"32px"}
            >
              {(flow === "token" ? tokenStatus?.tokenInfo?.name : nftStatus?.nftInfo?.name) || ""}
            </Text>
            <Flex p={"10px"} alignItems={"flex-end"}>
              <Text
                fontFamily={theme.fonts.primary}
                fontWeight={theme.fonts.light}
                fontSize={"12px"}
              >
                {(flow === "token" ? tokenStatus?.tokenInfo?.symbol : nftStatus?.nftInfo?.symbol) || ""}
              </Text>
            </Flex>
          </Flex>
          {address ? (
            <Flex mt={"60px"} flexDirection={"column"}>
              {flow === "nft" ? (
                <NftStatusCard
                  nftStatus={nftStatus}
                  deployedOnAllChain={deployedOnAllChain}
                  statusInternalLoader={statusInternalLoader}
                />
              ) : (
                <TokenStatusCard
                  tokenStatus={tokenStatus}
                  deployedOnAllChain={deployedOnAllChain}
                  statusInternalLoader={statusInternalLoader}
                />
              )}
            </Flex>
          ) : (
            <Flex alignItems={"center"}>
              <Text>Please connect your wallet</Text>
            </Flex>
          )}
        </Flex>
      )}
    </MainContainer>
  );
};

export default TokenDetails;
