import React, { useState, useRef } from "react";

import { CheckBox } from "../../component/CheckBox/index";
import { TextButton } from "../../component/Buttons";
import ModelViewer, {
  ModelViewerRef,
  CameraInfo,
} from "../../component/ModelViwer";
import color from "../../constants/color";
import {
  Screen,
  UploadInput,
  CardDescription,
  CardBox,
  HtmlInterface,
  SettingMenu,
  SettingItemBox,
} from "./style";

import { LoaderType } from "../../type/model";

export default function UploadScreen() {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const modelViewerRef = useRef<ModelViewerRef>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const labelCountRef = useRef(0);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files ? event.target.files[0] : undefined;

    // load(fileMap) {
    //   let rootFile;
    //   let rootPath;

    //   Array.from(fileMap).forEach(([path, file]) => {
    //     // if (file.name.match(/\.(gltf|glb)$/)) {
    //     rootFile = file;
    //     rootPath = path.replace(file.name, "");
    //     // }
    //   });

    //   if (!rootFile) {
    //     this.onError("No .gltf or .glb asset found.");
    //   }

    //   this.view(rootFile, rootPath, fileMap);
    // }

    if (file) {
      const type = getTypeOfFileUpload(file.name);

      console.log(type, file.name);
      if (!type) {
        return alert("지원하지 않는 파일 입니다.");
      }

      // console.log(
      //   file,
      //   URL.createObjectURL(file),
      //   THREE.LoaderUtils.extractUrlBase(URL.createObjectURL(file)),
      //   type,
      //   uploadInputRef.current?.value,
      //   uploadInputRef.current?.value.replace(file.name, "")
      // );

      // URL.revokeObjectURL(fileURL);

      // file
      const rootFile = file;
      const rootPath =
        uploadInputRef.current?.value.replace(file.name, "") || "";

      const fileURL = URL.createObjectURL(rootFile);
      const cleanup = () => {
        URL.revokeObjectURL(fileURL);
      };

      console.log({ rootFile, rootPath });
      modelViewerRef.current?.loadModel &&
        modelViewerRef.current?.loadModel({ fileURL, rootPath, file, type });

      cleanup();
      // path.replace(file.name, "");
      // this.view(rootFile, rootPath, fileMap, type);
    }
  };

  // modelViewerRef.current?.camera;

  const onAddLabels = () => {
    const camera = modelViewerRef.current?.camera;
    if (camera) {
      const { rotation, position } = camera;

      labelCountRef.current += 1;
      const newLabel = {
        name: `새 라벨 (${labelCountRef.current})`,
        position: [position.x, position.y, position.z],
        rotate: [rotation.x, rotation.y, rotation.z],
        color: "#" + Math.round(Math.random() * 0xffffff).toString(16),
      };
      setLabels((prev) => [...prev, newLabel]);
    }
  };
  const onDeleteLabels = (index: number) => {
    setLabels((prev) => prev.filter((p, i) => i !== index));
  };
  const cameraMoveForLabel = (label: Label) => {
    modelViewerRef.current?.setCamera &&
      modelViewerRef.current?.setCamera(label);
  };

  return (
    <Screen>
      <HtmlInterface>
        <CardBox style={{ margin: "8px" }}>
          <CardDescription>
            <h3>Labels !</h3>
            <div>특정 카메라 위치를 라벨로 저장하세요!</div>
            <div>라벨을 클릭하면 해당 위치로 이동합니다.</div>
          </CardDescription>

          <div>
            <TextButton
              style={{ marginBottom: labels.length > 0 ? "16px" : "0px" }}
              color={color.lightMainColor}
              onClick={() => onAddLabels()}
            >
              추가하기
            </TextButton>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {labels.map((label, i) => (
                <LabelItem
                  key={i}
                  label={label}
                  onClick={() => cameraMoveForLabel(label)}
                  onDelete={() => onDeleteLabels(i)}
                />
              ))}
            </div>
          </div>
        </CardBox>

        <CardBox style={{ margin: "8px" }}>
          <CardDescription>
            <h3>Upload !</h3>
            <div>업로드 버튼을 눌러 원하시는 3d 모델 파일을 선택하세요!</div>
            <div>현재 obj, fbx, gltf, glb 파일을 지원 하고 있습니다.</div>
          </CardDescription>

          <UploadInput
            ref={uploadInputRef}
            onChange={onChange}
            type="file"
            accept=".gltf, .glb, .obj, .fbx"
          />

          <TextButton
            color={color.lightMainColor}
            onClick={() => {
              uploadInputRef.current?.click();
              console.log("업로드 or 파일 선택 버튼 click");
            }}
          >
            {true ? "업로드" : "파일 선택"}
          </TextButton>
        </CardBox>
        <CardBox style={{ margin: "8px" }}>
          <CardDescription>
            <h3>Option !</h3>
            <div>다양한 옵션을 적용해서 모델을 보세요!</div>
          </CardDescription>

          <SettingMenu>
            <SettingItem
              text={"자동 회전"}
              onClick={(b) => {
                console.log(
                  { modelViewerRef: modelViewerRef.current?.setAutoRotate },
                  { ischeck: b }
                );
                modelViewerRef.current?.setAutoRotate &&
                  modelViewerRef.current?.setAutoRotate(b);
                // modelViewerRef.current
              }}
            />
          </SettingMenu>
        </CardBox>
      </HtmlInterface>

      {/* PerspectiveCamera */}
      <ModelViewer ref={modelViewerRef} />
    </Screen>
  );
}

// label
export interface Label extends CameraInfo {
  // id: number
  name: string;
  color: string;
}
interface LabelItemProps {
  label: Label;
  onClick: () => void;
  onDelete: () => void;
}
function LabelItem({ label, onClick, onDelete }: LabelItemProps) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <TextButton
        style={{ flex: 1, justifyContent: "space-between" }}
        color={label.color}
        onClick={() => onClick()}
      >
        <div>{label.name}</div>
      </TextButton>
      <div
        onClick={() => onDelete()}
        style={{
          padding: "0px 4px 0px 8px",
          color: "red",
          cursor: "pointer",
        }}
      >
        X
      </div>
    </div>
  );
}

export function getTypeOfFileUpload(fileName: string): LoaderType | null {
  const findIndex = [
    fileName.match(/\.(gltf|glb)$/),
    fileName.match(/\.obj$/),
    fileName.match(/\.fbx$/),
  ].findIndex((b) => b);
  return findIndex !== -1
    ? (["gltf", "obj", "fbx"][findIndex] as LoaderType)
    : null;
}

interface SettingItemProps {
  text: string;
  onClick: (b: boolean) => void;
  initialState?: boolean;
}
function SettingItem({
  text,
  onClick,
  initialState = false,
}: SettingItemProps) {
  const [check, setCheck] = useState(initialState);

  const _onClick = () => {
    onClick(!check);
    setCheck(!check);
  };

  return (
    <SettingItemBox>
      <div
        style={{ flexGrow: 1 }}
        color={color.mainColor}
        onClick={() => _onClick()}
      >
        {text}
      </div>
      <CheckBox size={15} onClick={() => _onClick()} check={check} />
    </SettingItemBox>
  );
}
