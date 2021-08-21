import styled from "styled-components";
import color from "../../constants/color";

interface TextButtonStyleProps {
  color: string;
  hoverColor?: string;
}
export const TextButtonStyle = styled.div<TextButtonStyleProps>`
  display: flex;
  align-items: "center";
  justify-content: "center";

  border: 0.5px solid ${color.gray};
  border-radius: 4px;
  padding: 8px 12px;

  background-color: ${({ color }) => color};

  cursor: pointer;
  & :hover {
    ${({ hoverColor }) =>
      hoverColor ? `background-color: ${hoverColor}` : ``};
  }
`;
