"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/src/types/index";
import type { Identifier } from "dnd-core";

const ITEM_TYPE = "CATEGORY";

interface DragItem {
  index: number;
  id: string;
}

interface DraggableCategoryProps {
  cat: Category;
  index: number;
  moveCategory: (dragIndex: number, hoverIndex: number) => void;
  onDrop: () => void;
}

export default function DraggableCategory({ cat, index, moveCategory, onDrop }: DraggableCategoryProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveCategory(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: () => {
      return { id: cat.id, index };
    },
    end: () => {
      onDrop();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const dragDropRef = (node: HTMLDivElement | null) => {
    ref.current = node;
    drop(drag(node));
  };

  return (
    <div
      ref={dragDropRef}
      data-handler-id={handlerId}
      className={cn(
        "flex items-center gap-1 group rounded-lg transition-colors mb-0.5",
        isDragging ? "opacity-30 border-2 border-dashed border-white/20" : "hover:bg-white/10"
      )}
    >
      <div className="flex items-center justify-center w-6 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
      </div>
      <Link href={`/admin/category/${cat.id}`} className="text-sm py-2 pr-3 text-white flex-1 truncate">
        {cat.name}
      </Link>
    </div>
  );
}
