import { CommonComponentProps } from "../../interface";
import { useComponentConfigStore } from "../../stores/component-config";
import { useEffect, useRef } from "react";
import { useMaterailDrop } from "../../hooks/useMaterialDrop";

export const ContainerDev = ({
  id,
  name,
  children,
  styles,
}: CommonComponentProps) => {
  const { componentConfig } = useComponentConfigStore();
  const ref = useRef<HTMLDivElement>(null);
  const acceptComponets = Object.values(componentConfig)
    .filter((item) => !item?.isNotDrop)
    .map((item) => item.name);
  const { canDrop, drop } = useMaterailDrop(acceptComponets, id);

  useEffect(() => {
    drop(ref);
  }, []);

  return (
    <div
      style={styles}
      data-component-id={id}
      ref={ref}
      className={`min-h-[100px] p-[20px] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
    >
      {children}
    </div>
  );
};
