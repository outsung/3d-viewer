import styled from "styled-components";
import color from "../../constants/color";

export interface CheckBoxStyleProps {
  check: boolean;
  size: number;
  onClick: () => void;
}
export const CheckBoxStyle = styled.div<CheckBoxStyleProps>`
  border: 1px solid ${color.black};
  border-radius: 5px;
  padding: 5px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;

  & > div {
    width: 100%;
    height: 100%;
    background-color: ${({ check }) => (check ? color.mainColor : color.white)};
  }
`;
