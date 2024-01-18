import { Box, Flex } from "components/Box";
import { InnerSection, MainContainer } from "./styles";
import { Text } from "components/Text";
import useTheme from "../../hooks/useTheme";
import Button from "components/Button";
import { Link } from "react-router-dom";

const CAT = () => {
  const { theme } = useTheme();
  return (
    <MainContainer>
      <InnerSection>
        <Flex justifyContent={"space-around"}>
          <Text
            fontFamily={theme.fonts.primary}
            fontWeight={theme.fonts.semiBold}
            fontSize={"32px"}
          >
            Chain-Agnostic Token (CAT)
          </Text>
        </Flex>
        <Flex justifyContent={"space-around"} mt={"21px"}>
          <Text
            fontFamily={theme.fonts.primary}
            fontStyle={"normal"}
            fontWeight={theme.fonts.light}
            fontSize={"14px"}
          >
            Take your token to multiple chains in minutes
          </Text>
        </Flex>
        <Flex justifyContent={"space-around"} mt={"21px"}>
          <Link to="/deploy/token?newToken=false">
            <Box>
              <Button
                height={"44px"}
                width={"471px"}
                type={"button"}
                variant={"tertiary"}
              >
                <Flex justifyContent={"center"}>
                  <Text
                    fontWeight={theme.fonts.semiBold}
                    fontSize={"14px"}
                    ml={"6px"}
                  >
                    Deploy existing token
                  </Text>
                </Flex>
              </Button>
            </Box>
          </Link>
        </Flex>
        <Flex justifyContent={"space-around"} mt={"21px"}>
          <Text>or</Text>
        </Flex>
        <Flex justifyContent={"space-around"} mt={"21px"}>
          <Link to="/deploy/token?newToken=true">
            <Box>
              <Button
                height={"44px"}
                width={"471px"}
                type={"button"}
                variant={"tertiary"}
              >
                <Flex justifyContent={"center"}>
                  <Text
                    fontWeight={theme.fonts.semiBold}
                    fontSize={"14px"}
                    ml={"6px"}
                  >
                    Deploy new token
                  </Text>
                </Flex>
              </Button>
            </Box>
          </Link>
        </Flex>
      </InnerSection>
    </MainContainer>
  );
};

export default CAT;
