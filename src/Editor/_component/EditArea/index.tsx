import React, { MouseEventHandler, useEffect, useState } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponetsStore } from "../../stores/components";
import HoverMask from "../HoverMask";
import SelectedMask from "../SelectedMask/index";

export function EditArea() {
  const { components, addComponent, setCurComponentId, curComponentId } =
    useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  const [hoverComponentId, setHoverComponentId] = useState<number>();

  //鼠标点击组件的事件
  const handleClick: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath();
    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;
      const componentId = ele.dataset?.componentId;
      if (componentId) {
        setCurComponentId(Number(componentId));
        return;
      }
    }
  };

  // 鼠标悬停事件处理函数，用于识别和高亮当前悬停的组件
  const handleMouseOver: MouseEventHandler = (e) => {
    // 获取事件的完整路径（从触发元素到根元素的所有元素）
    //由于react中的event是合成事件，有的原生的元素的属性没有存在react元素上，需要去使用nativeEvent获取原生的元素的属性
    const path = e.nativeEvent.composedPath();
    // 遍历路径中的每个元素
    for (let i = 0; i < path.length; i += 1) {
      // 将当前元素转换为HTMLElement类型
      const ele = path[i] as HTMLElement;
      // 获取元素上的组件ID
      const componentId = ele.dataset?.componentId;
      // 如果找到了组件ID
      if (componentId) {
        // 将组件ID转换为数字并设置为当前悬停的组件ID
        // 这将触发UI更新，高亮显示当前悬停的组件
        setHoverComponentId(Number(componentId));
        // 找到第一个带有组件ID的元素后立即退出循环
        break;
      }
    }
  };

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];

      if (!config?.dev) {
        return null;
      }

      return React.createElement(
        config.dev,
        {
          key: component.id,
          id: component.id,
          styles: component.styles,
          name: component.name,
          ...config.defaultProps,
          ...component.props,
        },
        renderComponents(component.children || [])
      );
    });
  }

  return (
    <div
      className="h-[100%] edit-area"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => {
        setHoverComponentId(undefined);
      }}
      onClick={handleClick}
    >
      {renderComponents(components)}
      {hoverComponentId && hoverComponentId !== curComponentId && (
        <HoverMask
          portalWrapperClassName="portal-wrapper"
          containerClassName="edit-area"
          componentId={hoverComponentId}
        ></HoverMask>
      )}
      {curComponentId && (
        <SelectedMask
          portalWrapperClassName="portal-wrapper"
          containerClassName="edit-area"
          componentId={curComponentId}
        ></SelectedMask>
      )}
      <div className="portal-wrapper"></div>
    </div>
  );
}
