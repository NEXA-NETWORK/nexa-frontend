import { Box, Flex } from "components/Box";
import { ChainWrapper } from "components/WalletModal/styles";
import { Text } from "components/Text";
import useTheme from "hooks/useTheme";

const WalletBox = () => {
  const { theme } = useTheme();
  const EvmWalletRow = () => {
    return (
      <Flex mb={"30px"}>
        <ChainWrapper
          flexDirection={"column"}
          alignItems={"center"}
          className={"selected"}
          mt="12px"
        >
          <Flex
            className="inner"
            flexDirection={"column"}
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
              fontSize={"11px"}
              fontWeight={theme.fonts.regular}
              color={theme.colors.textSubtle}
            >
              MetaMask
            </Text>
          </Flex>
        </ChainWrapper>
      </Flex>
    );
  };

  return (
    <Flex mb={"30px"}>
      {" "}
      <EvmWalletRow />
    </Flex>
  );
};

export default WalletBox;
