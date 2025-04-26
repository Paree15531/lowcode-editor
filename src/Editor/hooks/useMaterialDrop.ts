import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { useComponetsStore } from "../stores/components";

export const useMaterailDrop = (accept: Array<string>, id: number) => {
  const { addComponent } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  const [{ canDrop }, drop] = useDrop(() => {
    return {
      accept,
      drop: (item: { type: string }, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        const props = componentConfig[item.type].defaultProps;
        const config = componentConfig[item.type];

        addComponent(
          {
            id: new Date().getTime(),
            name: item.type,
            children: [],
            props,
            desc: config.desc,
          },
          id
        );
      },
      collect: (monitor) => {
        return {
          canDrop: monitor.canDrop(),
        };
      },
    };
  });
  return {
    canDrop,
    drop,
  };
};
