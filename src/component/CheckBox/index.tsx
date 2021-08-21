import React from "react";

import { CheckBoxStyle, CheckBoxStyleProps } from "./style";

export function CheckBox({ check, size, onClick }: CheckBoxStyleProps) {
  return (
    <CheckBoxStyle size={size} check={check} onClick={onClick}>
      <div />
    </CheckBoxStyle>
  );
}
