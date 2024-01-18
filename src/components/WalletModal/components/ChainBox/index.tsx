import { Box, Flex } from "components/Box";
import { ChainWrapper } from "components/WalletModal/styles";
import { Text } from "components/Text";
import useTheme from "hooks/useTheme";
import useViewport from "hooks/useViewport";
import { ChainArray } from "config/constants";
import { SupportedChainId } from "config/constants/chains";

const ChainBox = ({ setSelectedChain, selectedChain }) => {
  const { theme } = useTheme();
  const { width } = useViewport();
  const isMobile = width <= 990;

  return (
    <Flex alignItems={"center"} width={"100%"} flexWrap={"wrap"}>
      {ChainArray &&
        ChainArray?.map((networkChain, index) => {
          return (
            <Flex width={isMobile ? "160px" : "180px"} key={index}>
              <ChainWrapper
                onClick={() => {
                  setSelectedChain(networkChain.chainId);
                }}
                className={selectedChain === networkChain.chainId && "checked"}
                isSelected={selectedChain === SupportedChainId.OPTIMISM}
              >
                <Flex
                  className="inner"
                  flexDirection={"row"}
                  alignItems={"center"}
                >
                  <Box className="svg-icon">
                    {networkChain.icon}
                  </Box>
                  <Text
                    fontFamily={theme.fonts.primary}
                    fontSize={isMobile ? "14px" : "16px"}
                    fontWeight={theme.fonts.medium}
                    color={theme.colors.text}
                    ml={"0.6rem"}
                    lineHeight={"24px"}
                  >
                    {networkChain?.name}
                  </Text>
                </Flex>
              </ChainWrapper>
            </Flex>
          );
        })}
    </Flex>
  );
};

export default ChainBox;
