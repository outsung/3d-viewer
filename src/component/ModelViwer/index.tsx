import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as THREE from "three";
import { Group } from "three";

import { Canvas, useThree } from "@react-three/fiber";

import Controls, { ControlsRef } from "../../utils/Controls";
import color from "../../constants/color";
import { useCallback } from "react";

import { getLoader } from "../../loader";
import { LoaderType } from "../../type/model";

export type ModelViewerRef = Partial<SceneRef & ControlsRef>;
interface ModelViewerProps {}
const ModelViewer = React.forwardRef<ModelViewerRef, ModelViewerProps>(
  function (props, ref) {
    return (
      <>
        <Canvas>
          {/* scene */}
          <Scene
            ref={(_ref) => {
              if (ref && "current" in ref) {
                ref.current = ref.current
                  ? {
                      ...ref.current,
                      ..._ref,
                    }
                  : _ref;
              }
            }}
          />

          {/* utils */}
          <Controls
            ref={(_ref) => {
              if (ref && "current" in ref) {
                ref.current = ref.current
                  ? {
                      ...ref.current,
                      ..._ref,
                    }
                  : _ref;
              }
            }}
            autoRotate={false}
          />
          <gridHelper />
        </Canvas>
      </>
    );
  }
);
export default ModelViewer;

export interface CameraInfo {
  position: number[];
  rotate: number[];
}
interface LoadModelProps {
  fileURL: string;
  rootPath: string;
  file: File;
  type: LoaderType;
}
interface SceneRef {
  setCamera: (cameraInfo: CameraInfo) => void;
  camera: THREE.Camera;
  loadModel: (props: LoadModelProps) => void;
}
const Scene = forwardRef<SceneRef>(function (props, ref) {
  const [model, setModel] = useState<Group | null>(null);
  const { camera } = useThree();

  const setCamera = useCallback(
    (cameraInfo: CameraInfo) => {
      console.log("setCamera : ", { camera, cameraInfo });
      camera.position.x = cameraInfo.position[0];
      camera.position.y = cameraInfo.position[1];
      camera.position.z = cameraInfo.position[2];

      camera.rotateX(cameraInfo.rotate[0]);
      camera.rotateY(cameraInfo.rotate[1]);
      camera.rotateZ(cameraInfo.rotate[2]);
    },
    [camera]
  );

  const loadModel = useCallback(
    async ({ fileURL, rootPath, file, type }: LoadModelProps) => {
      const baseURL = THREE.LoaderUtils.extractUrlBase(fileURL);

      // const clips = model.animations || [];
      try {
        const scene = await load({ fileURL, rootPath, file, type, baseURL });
        console.log(scene);
        setModel(scene);
      } catch (e) {
        console.error(e, "e");
      }

      return;
    },
    [model]
  );

  useImperativeHandle(ref, () => ({ camera, setCamera, loadModel }), [
    camera,
    setCamera,
    loadModel,
    model,
  ]);

  return (
    <>
      {/* light */}
      <pointLight position={[3, 3, 3]} intensity={1.5} />
      <ambientLight intensity={1.5} />

      {/* model */}
      {model ? (
        <group ref={ref} scale={0.005}>
          <primitive object={model} />
        </group>
      ) : (
        <mesh onClick={() => {}}>
          <boxBufferGeometry />
          <meshStandardMaterial roughness={0.6} color={color.mainColor} />
        </mesh>
      )}
    </>
  );
});

interface loadProps extends LoadModelProps {
  baseURL: string;
}
const load = ({ fileURL, rootPath, file, type, baseURL }: loadProps) => {
  return new Promise<Group>((resolve, reject) => {
    const manager = new THREE.LoadingManager();
    // Intercept and override relative URLs.
    manager.setURLModifier((url) => {
      // URIs in a glTF file may be escaped, or not. Assume that assetMap is
      // from an un-escaped source, and decode all URIs before lookups.
      // See: https://github.com/donmccurdy/three-gltf-viewer/issues/146

      const blobURL = URL.createObjectURL(file);
      blobURLs.push(blobURL);

      return url;
    });

    const loader = getLoader({ type, manager });
    const blobURLs: any[] = [];

    loader.load(
      fileURL,
      (model: any) => {
        console.log({ model });
        const scene = model?.scenes ? model.scene || model.scenes[0] : model;

        scene.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
          /* max to webgl 회전 보정 */
          // if (child.isGroup) {
          //   child.rotation.x = Math.PI;
          //   child.rotation.y = Math.PI;
          //   child.rotation.z = Math.PI;
          // }
        });

        if (!scene) {
          // Valid, but not supported by this viewer.
          throw new Error(
            "파일에 Scene이 포함 되어있지 않거나, 3d 모델이 존재 하지 않습니다."
          );
        }

        blobURLs.forEach(URL.revokeObjectURL);
        // See: https://github.com/google/draco/issues/349
        // DRACOLoader.releaseDecoderModule();
        resolve(scene);
      },
      undefined,
      reject
    );
  });
};

//const rootFile = file.name;

// const fileURL =
// typeof rootFile === "string" ? rootFile : URL.createObjectURL(rootFile);

// const type = ["GLTF", "OBJ", "FBX"][
// [
//   file.name.match(/\.(gltf|glb)$/),
//   file.name.match(/\.obj$/),
//   file.name.match(/\.fbx$/),
// ].findIndex((b: RegExpMatchArray | null) => Boolean(b))
// ];

// console.log(file);
// console.log(`${rootFile}, ${fileURL}, ${type}`);
// if (type) {
// alert(`${rootFile}, ${fileURL}, ${type}`);
// }
