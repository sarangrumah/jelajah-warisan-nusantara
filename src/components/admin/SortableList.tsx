import { ReactNode, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SortableListProps<T> {
  items: T[];
  getId: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  onOrderChange: (newItems: T[]) => void;
  disabled?: boolean;
}

interface SortableRowProps<T> {
  item: T;
  id: string;
  index: number;
  total: number;
  renderItem: (item: T, index: number) => ReactNode;
  onMoveToPosition: (fromIndex: number, toPosition: number) => void;
  disabled?: boolean;
}

function SortableRow<T>({ item, id, index, total, renderItem, onMoveToPosition, disabled }: SortableRowProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  const [positionInput, setPositionInput] = useState<string>(String(index + 1));

  // Keep the numeric input in sync when order changes from outside (drag or other rows)
  const [lastIndex, setLastIndex] = useState(index);
  if (lastIndex !== index) {
    setLastIndex(index);
    setPositionInput(String(index + 1));
  }

  const commitPosition = () => {
    const parsed = parseInt(positionInput, 10);
    if (Number.isNaN(parsed)) {
      setPositionInput(String(index + 1));
      return;
    }
    const clamped = Math.min(Math.max(parsed, 1), total);
    if (clamped - 1 !== index) {
      onMoveToPosition(index, clamped - 1);
    } else {
      setPositionInput(String(index + 1));
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        aria-label={`Drag to reorder item ${index + 1}`}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} />
      </button>
      <Input
        type="number"
        min={1}
        max={total}
        value={positionInput}
        disabled={disabled}
        onChange={(e) => setPositionInput(e.target.value)}
        onBlur={commitPosition}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="w-16 text-center shrink-0"
        aria-label={`Position of item ${index + 1}`}
      />
      <div className="flex-1 min-w-0">{renderItem(item, index)}</div>
    </div>
  );
}

/**
 * Generic reorderable list: drag-and-drop (via drag handle) plus a manual
 * numeric position input per row. Both methods call onOrderChange with the
 * full reordered array.
 */
export function SortableList<T>({ items, getId, renderItem, onOrderChange, disabled }: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = items.map(getId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) { return; }
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) { return; }
    onOrderChange(arrayMove(items, oldIndex, newIndex));
  };

  const handleMoveToPosition = (fromIndex: number, toPosition: number) => {
    onOrderChange(arrayMove(items, fromIndex, toPosition));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item, index) => (
            <SortableRow
              key={getId(item)}
              id={getId(item)}
              item={item}
              index={index}
              total={items.length}
              renderItem={renderItem}
              onMoveToPosition={handleMoveToPosition}
              disabled={disabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
