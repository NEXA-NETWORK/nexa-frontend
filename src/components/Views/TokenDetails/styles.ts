import { Box, Flex } from "components/Box";
import styled from "styled-components";

export const MainContainer = styled(Box)`
  width: 88%;
  margin: auto;
  color: #fff;
  max-width: 1650px;
`;
export const InnerCard = styled(Box)`
  width: 100%;
  height: 200px;
  // margin:auto;
  background-color: #201d1d;
  border: 1px solid #201d1d;
  border-radius: 8px;
  margin-bottom: 25px;
  &.inner-token {
    width:100%;
  }

  .svg-icon {
    svg {
      width: 33px;
      height: 33px;
    }
  }

  .pointer-cursor {
    cursor:pointer;
  }
`;
export const SideCard = styled(Box)`
  width: 306px;
  height: 100px;
  max-width: 670px;
  border: 1px solid rgba(233, 233, 233, 0.2);
  border-radius: 8px;
  padding: 24px;
`;

export const Line = styled(Flex)`
  width: 100%;
  border: 0.5px solid #585858;
  color: #585858;
`;
export const StatusTags = styled(Flex) <{
  tabStyle?: { color: string; bg: string };
  radius?: string;
  padding?: string;
}>`
  width: 118px;
  background: ${({ tabStyle }) => tabStyle.bg};
  padding: ${({ padding }) => (padding ? padding : "4px 16px")};
  border-radius: ${({ radius }) => (radius ? radius : "4px")};
  color: ${({ tabStyle }) => tabStyle.color};
  align-items: center;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: ${({ theme }) => theme.fonts.medium};
  white-space: nowrap;
  ${({ theme }) => theme.mediaQueries.sm} {
    order: -1;
  }
`;
