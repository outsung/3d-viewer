import styled from "styled-components";

import color from "../../constants/color";

export const Screen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export const HtmlInterface = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1;
`;

export const UploadInput = styled.input`
  display: none;
`;

export const CardDescription = styled.div`
  margin-bottom: 16px;
  color: ${color.black};
`;

export const CardBox = styled.div`
  border-radius: 4px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.1);
`;

export const SettingMenu = styled.div``;
export const SettingItemBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;
