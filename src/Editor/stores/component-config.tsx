import { create } from "zustand";
import { ContainerDev } from "../materiais/Container/dev";
import ContainerProd from "../materiais/Container/prod";

import ButtonDev from "../materiais/Button/dev";
import ButtonProd from "../materiais/Button/prod";
import PageDev from "../materiais/Page/dev";
import PageProd from "../materiais/Page/prod";

export interface ComponentSetter {
  name: string;
  label: string;
  type: string;
  [key: string]: any;
}

export interface ComponentEvent {
  name: string;
  label: string;
}

export interface ComponentConfig {
  name: string;
  defaultProps: Record<string, any>;
  desc: string;
  setter?: ComponentSetter[];
  stylesSetter?: ComponentSetter[];
  events?: ComponentEvent[];
  isNotDrop?: boolean;
  dev: any;
  prod: any;
}

interface State {
  componentConfig: {
    [key: string]: ComponentConfig;
  };
}

interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void;
}

export const useComponentConfigStore = create<State & Action>((set) => {
  return {
    componentConfig: {
      Container: {
        name: "Container",
        defaultProps: {},
        desc: "容器",
        dev: ContainerDev,
        prod: ContainerProd,
      },
      Button: {
        name: "Button",
        defaultProps: {
          type: "primary",
          text: "按钮",
        },
        setter: [
          {
            name: "type",
            label: "按钮类型",
            type: "select",
            options: [
              { label: "主按钮", value: "primary" },
              {
                label: "次按钮",
                value: "default",
              },
            ],
          },
          {
            name: "text",
            label: "文本",
            type: "input",
          },
        ],
        stylesSetter: [
          {
            name: "width",
            label: "宽度",
            type: "inputNumber",
          },
          {
            name: "height",
            label: "高度",
            type: "inputNumber",
          },
        ],
        events: [
          {
            name: "onClick",
            label: "点击事件",
          },
          {
            name: "onDoubleClick",
            label: "双击事件",
          },
        ],
        desc: "按钮",
        dev: ButtonDev,
        prod: ButtonProd,
      },

      Page: {
        isNotDrop: true,
        name: "Page",
        defaultProps: {},
        desc: "页面",
        dev: PageDev,
        prod: PageProd,
      },
    },
    registerComponent(name, componentConfig) {
      set((state) => {
        return {
          ...state,
          componentConfig: {
            ...state.componentConfig,
            [name]: componentConfig,
          },
        };
      });
    },
  };
});
