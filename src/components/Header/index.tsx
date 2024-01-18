import { Text } from "components/Text";
import { Box, Flex } from "../Box";
import useTheme from "../hooks/useTheme";
import {
  BackButton,
  BackButtonBox,
  BackgroundContainer,
  HeaderItems,
  Navselectedoption,
  LogoImage,
  Dropdownmenu,
} from "./styles";
import Button from "components/Button";
import { WalletIcon } from "components/Svg";
import { useModal } from "widgets/Modal";
import WalletModal from "components/WalletModal";
import { truncateHash } from "utils";
import { useAccount } from "wagmi";
import useViewport from "hooks/useViewport";
import { Link, useHistory, useLocation } from "react-router-dom";

const Header = () => {
  const { theme } = useTheme();
  const { width } = useViewport();
  const isMobile = width <= 990;
  const { address, isConnected } = useAccount();
  const history = useHistory();
  const [showWalletConnectModal, onDismissConnected] = useModal(
    <WalletModal handleDismiss={() => onDismissConnected()} />,
    true
  );
  const location = useLocation();

  const paths = new Set([
    "/",
    "/cat/token",
    "/cat/nft",
    "/deploy/token",
    "/deploy/nft",
    "/details",
  ]);
  const bridgePaths = new Set([
    "/bridge/token",
    "/bridge/status",
    "/bridge/nft",
  ]);

  return (
    <BackgroundContainer>
      <Flex
        width={"100%"}
        justifyContent={"center"}
        flexDirection={"column"}
        margin={"auto"}
        mb={"30px"}
        mt={"30px"}
      >
        <HeaderItems className="risponsive-logo-topbar" tabIndex={-1}>
          <Flex>
            <Link to={{ pathname: "https://www.nexa.network/" }} target="_blank">
              <LogoImage
                src={
                  theme?.isDark
                    ? "../assets/images/Brandlockup.svg"
                    : "../assets/images/logo-light.png"
                }
                alt={"logo"}
              />
            </Link>
            <Flex alignItems={"center"} ml={"36px"} className="onhover-header">
              <Dropdownmenu>
                <Text
                  pt={"5px"}
                  fontFamily={theme.fonts.primary}
                  fontWeight={theme.fonts.regular}
                  fontSize={"16px"}
                  onClick={() => {
                    history.push("/cat/token");
                  }}
                >
                  Chain-Agnostic Token
                </Text>
                {paths.has(location.pathname) && (
                  <Navselectedoption width={"100%"} />
                )}
                <Flex className="dropdown">
                  <Flex
                    className={
                      (location.pathname === "/cat/token" ||
                        location.pathname === "/deploy/token") &&
                      "selected-item-border"
                    }
                    onClick={() => {
                      history.push("/cat/token");
                    }}
                  >
                    <Text
                      pt={"5px"}
                      fontFamily={theme.fonts.primary}
                      fontWeight={theme.fonts.regular}
                      fontSize={"14px"}
                      color={theme.colors.text}
                    >
                      {"Tokens"}
                    </Text>
                  </Flex>
                  <Flex
                    className={
                      (location.pathname === "/cat/nft" ||
                        location.pathname === "/deploy/nft") &&
                      "selected-item-border"
                    }
                    onClick={() => {
                      history.push("/cat/nft");
                    }}
                  >
                    <Text
                      pt={"5px"}
                      fontFamily={theme.fonts.primary}
                      fontWeight={theme.fonts.regular}
                      fontSize={"14px"}
                      color={theme.colors.text}
                    >
                      {"NFTs"}
                    </Text>
                  </Flex>
                </Flex>
              </Dropdownmenu>
            </Flex>
            <Flex alignItems={"center"} ml={"30px"} className="onhover-header">
              <Dropdownmenu>
                <Text
                  pt={"5px"}
                  fontFamily={theme.fonts.primary}
                  fontWeight={theme.fonts.regular}
                  fontSize={"16px"}
                  onClick={() => {
                    history.push("/bridge/token");
                  }}
                >
                  Bridge
                </Text>
                {bridgePaths.has(location.pathname) && <Navselectedoption />}
                <Flex className="dropdown" minWidth={"150px"}>
                  <Flex
                    justifyContent={"row"}
                    className={
                      location.pathname === "/bridge/token" &&
                      "selected-item-border"
                    }
                    onClick={() => {
                      history.push("/bridge/token");
                    }}
                  >
                    <Text
                      pt={"5px"}
                      fontFamily={theme.fonts.primary}
                      fontWeight={theme.fonts.regular}
                      fontSize={"14px"}
                      color={theme.colors.text}
                    >
                      {"Token"}
                    </Text>
                  </Flex>
                  <Flex
                    className={
                      location.pathname === "/bridge/nft" &&
                      "selected-item-border"
                    }
                    onClick={() => {
                      history.push("/bridge/nft");
                    }}
                  >
                    <Text
                      pt={"5px"}
                      fontFamily={theme.fonts.primary}
                      fontWeight={theme.fonts.regular}
                      fontSize={"14px"}
                      color={theme.colors.text}
                    >
                      {"NFT"}
                    </Text>
                  </Flex>
                </Flex>
              </Dropdownmenu>
            </Flex>
          </Flex>
          <Flex alignItems={"center"}>
            {isConnected ? (
              <BackButtonBox width={isMobile ? "300px" : "190px"}>
                <BackButton
                  onClick={showWalletConnectModal}
                  borderRadius={"4px"}
                >
                  <Box className="inner">
                    <WalletIcon mr={"5px"} />
                    <Text
                      fontWeight={theme.fonts.semiBold}
                      fontSize={"16px"}
                      ml={"6px"}
                    >
                      {" "}
                      {truncateHash(address, 5)}
                    </Text>
                  </Box>
                </BackButton>
              </BackButtonBox>
            ) : (
              <Box>
                <Button
                  height={"40px"}
                  width={"179px"}
                  type={"button"}
                  variant={"tertiary"}
                  onClick={() => {
                    showWalletConnectModal();
                  }}
                >
                  <Flex justifyContent={"center"}>
                    <WalletIcon
                      iconTheme={"light"}
                      width={"16px"}
                      height={"16px"}
                    />
                    <Text
                      fontWeight={theme.fonts.semiBold}
                      fontSize={"16px"}
                      ml={"6px"}
                    >
                      Connect wallet
                    </Text>
                  </Flex>
                </Button>
              </Box>
            )}
          </Flex>
        </HeaderItems>
      </Flex>
    </BackgroundContainer>
  );
};

export default Header;
