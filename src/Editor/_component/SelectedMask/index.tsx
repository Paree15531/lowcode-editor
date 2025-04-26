import { useState, useMemo, useEffect } from "react";
import { useComponetsStore } from "../../stores/components";
import { getComponentById } from "../../stores/components";
import { createPortal } from "react-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { Dropdown, Popconfirm, Space } from "antd";
import { ItemType } from "antd/es/menu/interface";

interface SelectedMaskProps {
  portalWrapperClassName: string;
  containerClassName: string;
  componentId: number;
}

function SelectedMask({
  portalWrapperClassName,
  containerClassName,
  componentId,
}: SelectedMaskProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });
  const { components, curComponentId, deleteComponent, setCurComponentId } =
    useComponetsStore();

  useEffect(() => {
    updatePosition();
  }, [componentId]);

  useEffect(() => {
    setTimeout(() => {
      updatePosition();
    }, 200);
  }, [components]);

  //处理编辑窗口由于改变视图大小后没有变化的逻辑
  useEffect(() => {
    const resizeHandler = () => {
      updatePosition();
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  function updatePosition() {
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { top, left, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();

    let labelTop = top - containerTop + container.scrollTop;
    let labelLeft = left - containerLeft + width;

    if (labelTop <= 0) {
      labelTop -= -20;
    }

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollTop,
      width,
      height,
      labelTop,
      labelLeft,
    });
  }

  const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)!;
  }, []);

  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  function handleDelete() {
    deleteComponent(curComponentId!);
    setCurComponentId(null);
  }

  const curSelectedComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  //获取当前选中组件的父组件列表
  const parentComponents = useMemo(() => {
    const parentComponent = [];
    let component = curComponent;
    while (component?.parentId) {
      component = getComponentById(component.parentId, components);
      parentComponent.push(component);
    }
    return parentComponent;
  }, [curComponent]);

  return createPortal(
    <>
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          border: "1px dashed blue",
          pointerEvents: "none",
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: "14px",
          zIndex: 13,
          display: !position.width || position.width < 10 ? "none" : "inline",
          transform: "translate(-100%, -100%)",
        }}
      >
        <Space>
          <Dropdown
            menu={{
              items: parentComponents.map((item: any) => ({
                key: item.id,
                label: item.desc,
              })),
              onClick: ({ key }) => {
                setCurComponentId(Number(key));
              },
            }}
            disabled={parentComponents.length === 0}
          >
            <div
              style={{
                padding: "0 8px",
                backgroundColor: "blue",
                borderRadius: 4,
                color: "#fff",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {curSelectedComponent?.desc}
            </div>
          </Dropdown>

          {curComponentId !== 1 && (
            <div style={{ padding: "0 8px", backgroundColor: "blue" }}>
              <Popconfirm
                title="确认删除？"
                okText={"确认"}
                cancelText={"取消"}
                onConfirm={handleDelete}
              >
                <DeleteOutlined style={{ color: "#fff" }} />
              </Popconfirm>
            </div>
          )}
        </Space>
      </div>
    </>,
    el
  );
}

export default SelectedMask;
