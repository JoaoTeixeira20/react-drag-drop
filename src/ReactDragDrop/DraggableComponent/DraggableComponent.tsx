import React, {
  useContext,
  DragEvent,
  PropsWithChildren,
  ReactElement,
  useMemo,
  TouchEvent,
  CSSProperties,
} from 'react';
import { DraggableContext } from '../DraggableContext/DraggableContext';

import { v4 as uuidv4 } from 'uuid';
import DraggaBleComponentActive from '../DraggableComponentActive/DraggableComponentActive';
import { actionType } from '../types/draggableLib.type';

type draggableComponentProps<T> = {
  id?: string;
  tableId: string;
  style?: CSSProperties;
  elementProps: T;
  action: actionType;
};

function DraggableComponent<T>(
  props: PropsWithChildren<draggableComponentProps<T>>
): ReactElement {
  const id = useMemo(() => props.id || uuidv4(), []);
  const {
    isHovering,
    isDragging,
    setIsDragging,
    setSelectedElement,
    draggedElementSpringApi,
  } = useContext(DraggableContext);

  function handleDragStartSource(event: DragEvent<HTMLElement>) {
    event.stopPropagation();
    setIsDragging(id);
    setSelectedElement(null);
    //eliminate initial animation from the top left of the screen
    draggedElementSpringApi.set({
      left: event.clientX,
      top: event.clientY,
    });
    //hide default drag display
    const img = new Image();
    img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    event.dataTransfer.setDragImage(img, 0, 0);
    event.dataTransfer.effectAllowed = props.action;
    // set data for the drag event
    event.dataTransfer.setData('id', id);
    event.dataTransfer.setData('action', props.action);
    event.dataTransfer.setData('tableId', props.tableId);
    event.dataTransfer.setData(
      'componentProps',
      JSON.stringify(props.elementProps)
    );
  }

  const handleDragSource = (event: DragEvent<HTMLElement>) => {
    !isHovering &&
      draggedElementSpringApi.start({
        left: event.clientX,
        top: event.clientY,
      });
  };

  const handleDragEndSource = () => {
    setIsDragging(null);
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    //eliminate initial animation from the top left of the screen
    draggedElementSpringApi.set({
      left: event.touches[0].clientX,
      top: event.touches[0].clientY,
    });
  };

  const handleTouchMove = (event: TouchEvent<HTMLElement>) => {
    !isHovering &&
      draggedElementSpringApi.start({
        left: event.touches[0].clientX,
        top: event.touches[0].clientY,
      });
  };

  return (
    <div style={{ ...props.style, position: 'relative' }}>
      <div
        style={{
          cursor: 'grab',
          position: 'relative',
          touchAction: 'none',
        }}
        draggable={true}
        onDragStart={handleDragStartSource}
        onDragEnd={handleDragEndSource}
        onDrag={handleDragSource}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div>
          {props.children}
        </div>
      </div>
      {isDragging === id && (
        <DraggaBleComponentActive>
          {props.children}
        </DraggaBleComponentActive>
      )}
    </div>
  );
}

export default DraggableComponent;
