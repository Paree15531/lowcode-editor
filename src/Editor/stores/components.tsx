import { CSSProperties } from "react";
import { create } from "zustand";

export interface Component {
  id: number;
  name: string;
  props: any;
  children: Component[];
  parentId?: number;
  styles?: CSSProperties;
  desc: string;
}

interface State {
  mode: "edit" | "preview";
  components: Component[];
  curComponentId?: number | null;
  curComponent: Component | null;
}

interface Action {
  addComponent: (component: Component, parentId: number) => void;
  deleteComponent: (componentId: number) => void;
  updateComponentProps: (componentId: number, props: any) => void;
  setCurComponentId: (componentId: number | null) => void;
  updateComponentStyles: (
    componentId: number,
    styles: CSSProperties,
    replace?: boolean
  ) => void;
  setMode: (mode: State["mode"]) => void;
}

export const useComponetsStore = create<State & Action>((set, get) => {
  return {
    mode: "edit",
    components: [
      {
        id: 1,
        name: "Page",
        props: {},
        desc: "页面",
        children: [],
      },
    ],
    curComponentId: null,
    curComponent: null,
    setCurComponentId: (componentId) => {
      set((state) => {
        return {
          curComponentId: componentId,
          curComponent: getComponentById(componentId, state.components),
        };
      });
    },
    addComponent: (component, parentId) =>
      set((state) => {
        if (parentId) {
          const parentComponent = getComponentById(parentId, state.components);

          if (parentComponent) {
            if (parentComponent.children) {
              parentComponent.children.push(component);
            } else {
              parentComponent.children = [component];
            }
          }

          component.parentId = parentId;
          return { components: [...state.components] };
        }
        return { components: [...state.components, component] };
      }),

    deleteComponent(componentId) {
      if (!componentId) return;
      const component = getComponentById(componentId, get().components);
      if (component?.parentId) {
        const parentComponent = getComponentById(
          component.parentId,
          get().components
        );

        if (parentComponent) {
          parentComponent.children = parentComponent?.children?.filter(
            (item) => item.id !== componentId
          );

          set({ components: [...get().components] });
        }
      }
    },

    updateComponentProps: (componentId, props) =>
      set((state) => {
        const component = getComponentById(componentId, state.components);
        if (component) {
          component.props = { ...component.props, ...props };

          return { components: [...state.components] };
        }

        return { components: [...state.components] };
      }),
    //更新组件样式
    updateComponentStyles(componentId, styles, replace) {
      set((state) => {
        const component = getComponentById(componentId, state.components);
        if (component) {
          component.styles = replace
            ? { ...styles }
            : { ...component.styles, ...styles };
          return { components: [...state.components] };
        }
        return { components: [...state.components] };
      });
    },
    //设置编辑器模式
    setMode: (state: State["mode"]) => {
      set({ mode: state });
    },
  };
});

//根据id获取指定组件
export function getComponentById(
  id: number | null,
  components: Array<Component>
): Component | null {
  if (!id) return null;
  for (const component of components) {
    if (component.id == id) return component;
    if (component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children);
      if (result !== null) return result;
    }
  }
  return null;
}
