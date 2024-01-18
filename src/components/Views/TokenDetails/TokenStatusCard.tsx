import { useEffect, useState } from "react";
import { CHAIN_IDS_TO_NAMES } from "config/constants/chains";
import { InnerCard, Line, SideCard, StatusTags } from "./styles";
import { Box, Flex } from "components/Box";
import { ChainArray, StatusStyles } from "config/constants";
import useTheme from "components/hooks/useTheme";
import { Text } from "components/Text";
import Button from "components/Button";
import {
  SaltResponse,
  TokenNetwork,
  DeployStatus,
  TokenStatusText,
} from "config/types";
import { copyToClipboard, truncateAddress, viewExplorer } from "utils";
import SkeletonLoader from "components/SkeletonLoader";
import { useHistory, useLocation } from "react-router";
import { CircleCheckedIcon, LinkIcon, WalletAddressIcon } from "components/Svg";

interface IProp {
  tokenStatus: SaltResponse;
  deployedOnAllChain: boolean;
  statusInternalLoader: boolean;
}

const TokenStatusCard: React.FC<IProp> = ({
  tokenStatus,
  deployedOnAllChain,
  statusInternalLoader,
}) => {
  const { theme } = useTheme();
  const history = useHistory();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [tokenAddressIndex, setTokenAddressIndex] = useState<number>(undefined);
  const flow = new URLSearchParams(location.search).get("flow");

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);
  const getStatusTag = (token: TokenNetwork) => {
    return (
      <StatusTags
        justifyContent={"center"}
        tabStyle={StatusStyles[token.status]}
      >
        {TokenStatusText[token.status]}
      </StatusTags>
    );
  };

  return (
    <Flex flexDirection={"row"}>
      <Flex flexDirection={"column"} width={"100%"}>
        {tokenStatus?.tokenNetworks.map((token, index) => {
          return (
            <InnerCard key={token?.chainId} className={"inner-token"}>
              <Flex
                alignItems={"center"}
                justifyContent={"space-between"}
                p={"10px 15px 5px"}
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
                ml={"20px"}
                alignContent="center"
                alignItems={"center"}
              >
                <Text
                  fontFamily={theme.fonts.primary}
                  fontWeight={theme.fonts.light}
                  fontSize={"14px"}
                >
                  {"Token address"}
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
                      setTokenAddressIndex(index);
                    }}
                  >
                    {" "}
                    {copied && tokenAddressIndex === index ? (
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
              <Flex mt={"15px"} ml={"21px"} alignItems={"center"}>
                <Text
                  fontFamily={theme.fonts.primary}
                  fontWeight={theme.fonts.light}
                  fontSize={"14px"}
                >
                  {"Token supply"}
                </Text>
                <Text
                  fontFamily={theme.fonts.primary}
                  fontWeight={theme.fonts.light}
                  color={theme.colors.textDisabled}
                  fontSize={"14px"}
                  ml={"25px"}
                >
                  {token?.supply ? +token?.supply : "-"}
                </Text>
              </Flex>
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
            {"You can move your token across chains."}
          </Text>
          <Box mt={"16px"}>
            <Button
              height={"44px"}
              width={"306px"}
              type={"button"}
              variant={"tertiary"}
              disabled={deployedOnAllChain}
              onClick={() => history.push("/bridge/token")}
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

export default TokenStatusCard;
