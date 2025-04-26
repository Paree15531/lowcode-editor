import { useState } from "react";
import { useComponetsStore } from "../../stores/components";
import { Segmented } from "antd";
import { ComponentAttr } from "./_components/ComponentAttr";
import { ComponentStyle } from "./_components/ComponentStyle";
import { ComponentEvent } from "./_components/ComponentEvent";

export function Setting() {
  const { curComponentId } = useComponetsStore();

  const [key, setKey] = useState<string>("属性");

  if (!curComponentId) {
    return null;
  }

  return (
    <div className=" overflow-hidden">
      <Segmented
        value={key}
        onChange={setKey}
        block
        options={["属性", "样式", "事件"]}
      ></Segmented>
      <div className="pt-5">
        {" "}
        {key === "属性" && <ComponentAttr />}
        {key === "样式" && <ComponentStyle />}
        {key === "事件" && <ComponentEvent />}
      </div>
    </div>
  );
}
