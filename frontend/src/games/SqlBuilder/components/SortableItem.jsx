import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export default function SortableItem({ id, clause }) {
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
      className="flex items-center gap-3 bg-dark-bg border-2 border-gray-700 rounded-lg p-4 cursor-move hover:border-primary transition-colors"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="text-gray-500" size={20} />
      <code className="text-cyan-300 font-mono">{clause}</code>
    </div>
  );
}





