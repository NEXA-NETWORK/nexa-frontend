import { Modal } from "widgets/Modal";
import { useEffect, useState } from "react";
import { ContinueButton, WalletWrapper } from "./styles";
import ChainBox from "./components/ChainBox";
import WalletBox from "./components/WalletBox";
import { Box, Flex } from "components/Box";
import { CHAIN_IDS_TO_NAMES } from "../../config/constants/chains";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSignMessage,
} from "wagmi";
import useViewport from "hooks/useViewport";
import { Text } from "components/Text";
import { copyToClipboard } from "utils";
import useTheme from "hooks/useTheme";
import {
  CircleCheckedIcon,
  CopyIcon,
  DisconnectIcon,
  WalletIcon as WalletIconSVG,
} from "components/Svg";
import {
  walletConnect,
  selectIsConnected,
} from "./../../features/wallet/walletSlice";
import { authMessage, ChainArray } from "config/constants";
import { useAppDispatch, useAppSelector } from "app/hooks";

const WalletModal = ({ handleDismiss }) => {
  const dispatch = useAppDispatch();
  const isConnectedWallet = useAppSelector(selectIsConnected);
  const { width } = useViewport();
  const isMobile = width <= 990;
  const [copied, setCopied] = useState(false);
  const { address, isConnected } = useAccount();
  const { theme } = useTheme();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  const [selectedChain, setSelectedChain] = useState<number | undefined>();
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);
  const { signMessage, isLoading } = useSignMessage({
    message: authMessage,
    onSuccess() {
      dispatch(walletConnect(true));
      setWalletConnected(true);
    },
    onError() {
      disconnect();
    },
  });
  const signAuthMessage = async () => {
    await signMessage();
  };
  const {
    connect,
    connectors,
    pendingConnector,
    isLoading: isConnectingLoader,
  } = useConnect({
    chainId: selectedChain,
    onSuccess() {
      signAuthMessage();
    },
  });
  useEffect(() => {
    if (walletConnected) {
      handleDismiss();
    }
    //eslint-disable-next-line
  }, [walletConnected]);
  return (
    <Modal
      hideCloseButton={false}
      onDismiss={handleDismiss}
      title={
        isConnectedWallet && isConnected
          ? "Wallet & Chain"
          : "Select a chain & wallet"
      }
      minWidth={"100%"}
      minHeight={"100%"}
    >
      {isConnected && isConnectedWallet ? (
        <WalletWrapper className={"wallet-wrapper"} alignItems={'center'}>
          <Flex className="border-none">
            <Flex
              className="inner inner-wallet"
              minHeight={"0"}
              flexDirection={"row"}
              alignItems={"center"}
            >
              <Box className="svg-icon">
                <img
                  src={"../assets/images/metamask1.svg"}
                  width={"40px"}
                  height={"40px"}
                  alt=""
                />
              </Box>
              <Text
                fontFamily={theme.fonts.primary}
                fontSize={"16px"}
                fontWeight={theme.fonts.medium}
                color={theme.colors.text}
                ml={"0.6rem"}
              >
                MetaMask
              </Text>
            </Flex>
            <Flex
              className="inner inner-wallet border-none"
              minHeight={"0"}
              flexDirection={"row"}
              alignItems={"center"}
            >
              <Box className="svg-icon">
                {
                  ChainArray?.find(
                    (chainItem) => chain?.id === chainItem?.chainId
                  )?.icon
                }
              </Box>
              <Text
                fontFamily={theme.fonts.primary}
                fontSize={"14px"}
                fontWeight={theme.fonts.light}
                color={theme.colors.text}
                ml={"0.6rem"}
              >
                {CHAIN_IDS_TO_NAMES[chain?.id]}
              </Text>
            </Flex>
          </Flex>
          <Flex
            className="inner inner-wallet border-none wallet-icon"
            borderRadius={"8px"}
            justifyContent={"center"}
            alignItems={"center"}
            background={`${theme.colors.backgroundAlt}80`}
            p={"0.4rem"}
          >
            <WalletIconSVG />{" "}
            <Text
              color={theme.colors.textDisabled}
              fontSize={"14px"}
              lineHeight={"1.3"}
              ml={"0.4rem"}
              className="address-styles"
            >
              {address}
            </Text>
          </Flex>
          <Flex
            className="inner inner-wallet border-none"
            flexDirection={"column"}
            py={"1px"}
          >
            <Flex
              width={"100%"}
              alignItems={"center"}
              justifyContent={isMobile ? "space-between" : "center"}
            >
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                role={"button"}
                height={"100%"}
                minWidth={"100px"}
                onClick={() => {
                  copyToClipboard(address);
                  setCopied(true);
                }}
              >
                {copied ? (
                  <CircleCheckedIcon fill={"none"} mr={"5px"} height={"20"} />
                ) : (
                  <CopyIcon
                    stroke={"#4276FF"}
                    mr={"5px"}
                    width={"20"}
                    height={"20"}
                  />
                )}
                <Text
                  fontSize={"x-small"}
                  className={copied ? "copied-color" : "text-color"}
                >
                  {copied ? "Copied" : "Copy"}
                </Text>
              </Flex>

              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                mx={isMobile ? "0" : "0.4rem"}
                role={"button"}
                className="disconnet-btn pointer"
                onClick={async () => {
                  setSelectedChain(undefined);
                  await disconnect();
                  dispatch(walletConnect(false));
                }}
              >
                <DisconnectIcon width={"30"} height={"30"} />
                <Text>Disconnect</Text>
              </Flex>
            </Flex>
          </Flex>
        </WalletWrapper>
      ) : (
        <WalletWrapper>
          <Flex flexDirection={"column"} flex={1}>
            <ChainBox
              setSelectedChain={setSelectedChain}
              selectedChain={selectedChain}
            />
          </Flex>
          <Flex
            flexDirection={"column"}
            justifyContent={isMobile && "space-between"}
            flex={1}
          >
            <WalletBox />
            {connectors.map((connector) => (
              <ContinueButton
                isLoading={isLoading || isConnectingLoader}
                disabled={!connector.ready || !selectedChain}
                key={connector.id}
                onClick={() => {
                  connect({ connector });
                }}
              >
                Connect
                {!connector.ready && " (unsupported)"}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  " (connecting)"}
              </ContinueButton>
            ))}
          </Flex>
        </WalletWrapper>
      )}
    </Modal>
  );
};

export default WalletModal;
