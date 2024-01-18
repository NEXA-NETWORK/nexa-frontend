import { InnerSection } from "./styles";
import { Box, Flex } from "components/Box";
import { Text } from "components/Text";
import BridgeStatus from "components/BridgeStatus";
import Spinner from "components/SpinnerCircle";
import Button from "components/Button";
import useTheme from "../../hooks/useTheme";
import { ADDRESS_TXN_EXPLORER_LINK } from "config/constants/endpoints";
import { LinkIcon } from "components/Svg";
import { BridgeStatusResponse, TokenBridgeStatus } from "config/types";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBridgeStatus } from "services/token.service";
import useRefresh from "hooks/useRefresh";
import { useAccount } from "wagmi";
import { getNftBridgeStatus } from "services/nft.service";
import { viewExplorer } from "utils";

const Bridgeprogress = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const history = useHistory();
  const { tenSecondRefresh } = useRefresh();
  const { address } = useAccount();

  const tokenId: string = new URLSearchParams(location.search).get("token");
  const nftId: string = new URLSearchParams(location.search).get("nft");

  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatusResponse>();

  useEffect(() => {
    if (
      address &&
      (bridgeStatus?.initiateBridgeTxHash === undefined ||
        bridgeStatus?.relayerBridgeTxHash === undefined) &&
      bridgeStatus?.status !== TokenBridgeStatus.BRIDGE_ERROR
    ) {
      if (tokenId) {
        fetchBridgeStatus();
      }
      else if (nftId) {
        fetchNftBridgeStatus();
      }
    }
  }, [tokenId, address, tenSecondRefresh, nftId]);

  const fetchNftBridgeStatus = async () => {
    const res = await getNftBridgeStatus(nftId)
    setBridgeStatus(res);
  }

  const fetchBridgeStatus = async () => {
    const res = await getBridgeStatus(tokenId);
    setBridgeStatus(res);
  };
  return (
    bridgeStatus?.status && (
      <InnerSection>
        <Flex flexDirection={"column"}>
          <Flex justifyContent={"space-around"}>
            <Text
              fontFamily={theme.fonts.primary}
              fontWeight={theme.fonts.semiBold}
              fontSize={"32px"}
            >
              Bridge
            </Text>
          </Flex>
          { (bridgeStatus?.blockConfirmationDone && bridgeStatus?.totalBlockConfirmation) && (
          <Flex justifyContent={"space-around"} mt={'21px'}>
          <Text
              fontFamily={theme.fonts.primary}
              fontWeight={theme.fonts.semiBold}
              fontSize={"14px"}
            >
              {bridgeStatus?.blockConfirmationDone >= bridgeStatus?.totalBlockConfirmation ? bridgeStatus?.totalBlockConfirmation : bridgeStatus?.blockConfirmationDone}    
              {`/${bridgeStatus?.totalBlockConfirmation} Confirmations`}
            </Text>
          </Flex>
          )}
          <Flex justifyContent={"space-around"} mt={'15px'}>
            {bridgeStatus?.initiateBridgeTxHash &&
              bridgeStatus?.relayerBridgeTxHash ? (
              <BridgeStatus
                variant="success"
                type={"success"}
                message={"Migration completed"}
              />
            ) : (
              <BridgeStatus
                variant="warning"
                type={"warning"}
                message={"Migration in progress"}
              />
            )}
          </Flex>
          <Flex flexDirection={"column"} mt={'20px'}>
            {bridgeStatus?.initiateBridgeTxHash ? (
              <Flex flexDirection={"row"} alignItems={"center"}>
                <BridgeStatus
                  variant="info"
                  type={"info"}
                  message={tokenId ? "Tokens are burned on home chain" : "NFT is burned on home chain"}
                />
                <Flex
                  mb={"15px"}
                  ml={"10px"}
                  className="explorerLink"
                  onClick={() => {
                    viewExplorer(
                      bridgeStatus?.fromChainId,
                      bridgeStatus?.initiateBridgeTxHash
                    );
                  }}
                >
                  <Text
                    fontFamily={theme.fonts.primary}
                    fontWeight={theme.fonts.medium}
                    fontSize={"14px"}
                    color={theme.colors.link}
                    mr="5px"
                  >
                    View on explorer
                  </Text>
                  <LinkIcon width={"12px"} color={theme.colors.link} />
                </Flex>
              </Flex>
            ) : TokenBridgeStatus.BRIDGE_ERROR === bridgeStatus?.status && bridgeStatus?.initiateBridgeTxHash === undefined ? (
              <Flex flexDirection={"row"} alignItems={"center"}>
                <BridgeStatus
                  variant="error"
                  type={"info"}
                  message={"Error while burning on home chain"}
                />
              </Flex>
            ) : (
              <Flex flexDirection={"row"}>
                <Spinner radius={8} />
                <Flex ml={"10px"}>
                  <Text
                    fontFamily={theme.fonts.primary}
                    fontWeight={theme.fonts.medium}
                    fontSize={"14px"}
                  >
                    Burning on home chain
                  </Text>
                </Flex>
              </Flex>
            )}

            {bridgeStatus?.relayerBridgeTxHash ? (
              <Flex flexDirection={"row"} alignItems={"center"} mt={'15px'}>
                <BridgeStatus
                  variant="info"
                  type={"info"}
                  message={tokenId ? "Tokens are minted on destination chain" : "NFT is minted on destination chain"}
                />
                <Flex
                  mb={"15px"}
                  ml={"10px"}
                  className="explorerLink"
                  onClick={() => {
                    viewExplorer(
                      bridgeStatus?.toChainId,
                      bridgeStatus?.relayerBridgeTxHash
                    );
                  }}
                >
                  <Text
                    fontFamily={theme.fonts.primary}
                    fontWeight={theme.fonts.medium}
                    fontSize={"14px"}
                    color={theme.colors.link}
                    mr="5px"
                  >
                    View on explorer
                  </Text>
                  <LinkIcon width={"12px"} color={theme.colors.link} />
                </Flex>
              </Flex>
            ) : bridgeStatus?.relayerBridgeTxHash === undefined && TokenBridgeStatus.BRIDGE_ERROR === bridgeStatus?.status ? (
              <Flex flexDirection={"row"} alignItems={"center"}>
                <BridgeStatus
                  variant="error"
                  type={"info"}
                  message={"Error while minting on destination chain"}
                />
              </Flex>
            ) : (
              <Flex flexDirection={"row"} mt={"20px"}>
                <Spinner radius={8} />
                <Flex ml={"10px"}>
                  <Text
                    fontFamily={theme.fonts.primary}
                    fontWeight={theme.fonts.medium}
                    fontSize={"14px"}
                  >
                    Minting on destination chain
                  </Text>
                </Flex>
              </Flex>
            )}
          </Flex>
          <Flex mt={"25px"}>
            <Box>
              <Button
                height={"44px"}
                width={"478px"}
                type={"button"}
                variant={"tertiary"}
                onClick={() => history.push(tokenId ? "/bridge/token" : "/bridge/nft")}
              >
                <Flex justifyContent={"center"}>
                  <Text
                    fontWeight={theme.fonts.semiBold}
                    fontSize={"14px"}
                    ml={"6px"}
                  >
                    Close
                  </Text>
                </Flex>
              </Button>
            </Box>
          </Flex>
        </Flex>
      </InnerSection >
    )
  );
};

export default Bridgeprogress;
