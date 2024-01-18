import { Box, Flex } from "components/Box";
import styled from "styled-components";

export const MainContainer = styled(Box)`
  width: 88%;
  margin: auto;
  color: #fff;
  max-width: 1650px;

  .chain-options {
    display: flex;
    background-color: #201d1d;
    align-items: center;
  }

  .select-main-container {
    displays: block;
    width: calc(50% - 20px);
    background-color: #201d1d;
    border-radius: 8px;
  }

  .border-color {
    border-color: #cc0000;
  }
  .svg-icons {
    svg {
      width: 40px;
      height: 40px;
    }
  }
  .select-svg-icon svg {
    height: 30px;
    width: 30px;
  }
`;
export const InnerSection = styled(Box)`
  width: 100%;
  max-width: 670px;
  margin: 60px auto auto;
  border: 1px solid rgba(233, 233, 233, 0.2);
  border-radius: 8px;
  padding: 33px;
`;

export const Dropdown = styled.select`
height: 48px;
  border-radius: 4px;
  padding: 0 8px;
  border :none;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  position: relative;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  border:2px solid transparent;
  &:nth-last-child(3) {
    border: 2px solid rgba(251,23,23,0.4);
  }
  &:focus {
    color: ${({ theme }) => theme.colors.text};
    outline:none;
  }
  &:focus:nth-last-child(2) ~ span {
    max-height:48px;
    border-radius: 4px; /*1*/
  border: 1px solid transparent; /*2*/
  background: linear-gradient(133.82deg, #513CFF 13.2%, #23ABD4 100%) border-box; /*3*/
  -webkit-mask: /*4*/
     linear-gradient(#fff 0 0) padding-box, 
     linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; /*5'*/
  -webkit-mask-composite: exclude;
    mask-composite: exclude; /*5*/

    width: 45%;
    position: absolute;
    top: 42px;
    bottom: 0px;
    border-radius: 4px;
    pointer-events:none;
  }
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
  }
  
  ::-webkit-datetime-edit-text,
  ::-webkit-datetime-edit-month-field,
  ::-webkit-datetime-edit-day-field,
  ::-webkit-datetime-edit-year-field,
  ::-webkit-datetime-edit-hour-field,
  ::-webkit-datetime-edit-minute-field,
  ::-webkit-datetime-edit-second-field,
  ::-webkit-datetime-edit-ampm-field {
    color: ${({ theme }) => theme.colors.hover};
    text-transform: uppercase;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.hover};
    font-size: 12px;
    font-family: ${({ theme }) => theme.fonts.secondary};
    font-weight: ${({ theme }) => theme.fonts.light};
  }

  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus {
    border: none;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.text};
    -webkit-box-shadow: 0 0 0px 1000px ${({ theme }) =>
      theme.colors.backgroundAlt} inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

export const Input = styled.input<{
  padding?: string;
}>`
  height: 48px;
  border-radius: 8px;
  padding:${({ padding }) => (padding ? padding : "0 17px")};
  border :none;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textDisabled};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  position: relative;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  border:2px solid transparent;
  &:nth-last-child(3) {
    border: 2px solid rgba(251,23,23,0.4);
  }
  &:focus {
    color: ${({ theme }) => theme.colors.textDisabled};
    outline:none;
  }
  &:focus:nth-last-child(2) ~ span {
    max-height:48px;
    border-radius: 4px; /*1*/
  border: 1px solid transparent; /*2*/
  background: linear-gradient(133.82deg, #513CFF 13.2%, #23ABD4 100%) border-box; /*3*/
  -webkit-mask: /*4*/
     linear-gradient(#fff 0 0) padding-box, 
     linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; /*5'*/
  -webkit-mask-composite: exclude;
    mask-composite: exclude; /*5*/

    width: 45%;
    position: absolute;
    top: 42px;
    bottom: 0px;
    border-radius: 8px;
    pointer-events:none;
  }
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
  }
  
  ::-webkit-datetime-edit-text,
  ::-webkit-datetime-edit-month-field,
  ::-webkit-datetime-edit-day-field,
  ::-webkit-datetime-edit-year-field,
  ::-webkit-datetime-edit-hour-field,
  ::-webkit-datetime-edit-minute-field,
  ::-webkit-datetime-edit-second-field,
  ::-webkit-datetime-edit-ampm-field {
    color: ${({ theme }) => theme.colors.hover};
    text-transform: uppercase;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.hover};
    font-size: 12px;
    font-family: ${({ theme }) => theme.fonts.secondary};
    font-weight: ${({ theme }) => theme.fonts.light};
  }

  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus {
    border: none;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.text};
    -webkit-box-shadow: 0 0 0px 1000px ${({ theme }) =>
      theme.colors.backgroundAlt} inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  .cursor-hide {
    caret-color: transparent !important;
  }
`;

export const ChianCol = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  display: flex;
  margin-bottom: 20px;
  width: 48%;
  padding-right: 18px;
`;

export const Switch = styled(Flex)<{
  isChecked?: boolean;
  isDisabled: boolean;
}>`
  background: ${({ theme, isChecked }) =>
    isChecked ? theme.colors.buttonprimary : "rgba(120, 120, 128, 0.16)"};
  border-radius: 30px;
  height: 24.22px;
  width: 38.84px;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
`;

export const SwitchToggle = styled(Flex)<{ state: boolean }>`
  background: ${({ theme, state }) =>
    state ? theme.colors.text : "transparent"};
  border-radius: 50%;
  width: 21px;
  height: 21px;
  align-items: center;
  justify-content: center;
`;
