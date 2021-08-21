import React, { useState } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, OrbitControlsProps } from "@react-three/drei";
import { useImperativeHandle } from "react";

export interface ControlsRef {
  setAutoRotate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}
const Controls = React.forwardRef<ControlsRef, OrbitControlsProps>(function (
  { ...props },
  ref
) {
  const [autoRotate, setAutoRotate] = useState(props.autoRotate);
  const { camera } = useThree();

  useImperativeHandle(
    ref,
    () => ({
      setAutoRotate: setAutoRotate,
    }),
    []
  );

  return <OrbitControls autoRotate={autoRotate} camera={camera} />;
});
export default Controls;
