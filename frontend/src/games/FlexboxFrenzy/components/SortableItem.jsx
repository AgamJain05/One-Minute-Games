import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableItem({ id, item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-center bg-primary text-white font-bold rounded-lg p-4 min-w-[80px] h-20 cursor-move hover:bg-primary-dark transition-colors"
      {...attributes}
      {...listeners}
    >
      {item}
    </div>
  );
}





