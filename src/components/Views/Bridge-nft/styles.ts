import styled from "styled-components";

export const NFTinput = styled.label`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px 10px;
gap: 352px;
color: #AAAAAA;
font-family: 'Poppins';
font-style: normal;
font-weight: 300;
font-size: 14px;
line-height: 21px;

width: 478px;
height: 48px;
left: 100px;
top: 140px;

background: #201D1D;
border-radius: 8px;

&:after {
    content: "";
    border: 2px solid #FFFFFF;
    margin-left: 25px;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
}
`