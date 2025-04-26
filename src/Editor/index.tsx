import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Header } from "./_component/Hearder";
import { EditArea } from "./_component/EditArea";
import { Setting } from "./_component/Setting";
import { MaterialWrapper } from "./_component/MaterialWrapper/index";
import { Preview } from "./_component/Preview";
import { useComponetsStore } from "./stores/components";

export default function Editor() {
  const { mode } = useComponetsStore();
  //这是测试文本
  return (
    <div className="h-screen flex flex-col">
      <div className="h-[60px] flex items-center border-b-[1px] border-[#000]">
        <Header></Header>
      </div>
      {mode === "edit" ? (
        <Allotment>
          <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
            <MaterialWrapper></MaterialWrapper>
          </Allotment.Pane>
          <Allotment.Pane>
            <EditArea></EditArea>
          </Allotment.Pane>
          <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
            <Setting></Setting>
          </Allotment.Pane>
        </Allotment>
      ) : (
        <Preview></Preview>
      )}
    </div>
  );
}
