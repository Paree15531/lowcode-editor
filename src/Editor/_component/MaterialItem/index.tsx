import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";

export interface MaterialItemProps {
  name: string;
  desc: string;
}

export function MaterialItem(props: MaterialItemProps) {
  const { name, desc } = props;
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
    },
  });

  useEffect(() => {
    drag(ref);
  }, [name]);

  return (
    <div
      ref={ref}
      className="border-dashed border-[1px] border-[#000] py-[8px] px-[10px] m-[10px] cursor-move inline-block bg-white hover:bg-[#ccc]"
    >
      {desc}
    </div>
  );
}
