import { Box } from "components/Box";
import styled from "styled-components";

export const MainContainer = styled(Box)`
margin-top: 50px;
width: 20%;
`
export const NFTMainContainer = styled(Box)`
margin-top: 50px;
width: 15%;
`

export const ImageContainer = styled(Box)`
width: 170px;
height: 170px;
box-sizing: border-box;
border: 1px solid rgba(233, 233, 233, 0.2);
border-radius: 8px;
position: relative;
&:before, &:after {
    content:'';
    position: absolute;

    border:2px solid rgba(233,233,233,0.2);
    border-radius:8px;
    z-index:-1;
}
&:before {
    top: 5px;
    right: -7px;
    bottom: -9px;
    left: 10px;
}
&:after {
    top: 10px;
    right: -13px;
    bottom: -15px;
    left: 22px;
}

&.selected-border {
  border:3px solid #2F8EDF;
}
img {
  max-width:100%;
  border-radius:8px;
}
`

export const Closeicon = styled(Box)`
right: 70px;
  top: 52px;
  width: 25px;
  height: 20px;
  opacity: 1;
  color: #AAAAAA;
  position: absolute;
  border-radius: 3px;

  &:hover {
    opacity: 0.3;
    cursor: pointer;
  }

  &:before, &:after {
    position: absolute;
    left: 25%;
    top: 50%;
    content: ' ';
    height: 25px;
    width: 4px;
    background-color: white;
    color: #AAAAAA;
    border-radius: 3px;
  }

  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`

export const NFTimgcontainer = styled(Box)`
width: 120px;
height: 120px;
box-sizing: border-box;

left: 84px;
top: 191px;

border: 1px solid rgba(233, 233, 233, 0.2);
border-radius: 8px;

img {
  max-width:100%;
  border-radius:8px;
}

&.selected-border {
  border:3px solid #2F8EDF;
}
`