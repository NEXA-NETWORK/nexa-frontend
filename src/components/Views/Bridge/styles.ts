import styled from "styled-components";
import { Box } from "../../Box";

export const MainContainer = styled(Box)`
  width: 78%;
  margin: auto;
  color: #fff;

  .select-main-container {
    width: 100%;
    background-color: #201d1d;
    border-radius: 8px;
  }

  .chain-options {
    display: flex;
    background-color: #201d1d;
    align-items: center;
    color: #fffff;
  }
`;

export const InnerSection = styled(Box)`
  width: 100%;
  max-width: 500px;
  margin: 60px auto auto;
  border: 1px solid rgba(233, 233, 233, 0.2);
  border-radius: 8px;
  padding: 33px 100px;
  margin-bottom: 30px;

  .explorerLink {
    cursor: pointer;
  }

  .select-svg-icon svg {
    height: 30px;
    width: 30px;
  }
`;
