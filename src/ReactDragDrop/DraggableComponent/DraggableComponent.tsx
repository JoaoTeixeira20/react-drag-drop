import React, {
  useContext,
  DragEvent,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useMemo,
  TouchEvent,
  CSSProperties,
  useRef,
} from 'react';
import { SpringValues, animated, useSpring } from '@react-spring/web';
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
  const componentRef = useRef<HTMLDivElement>(null);
  const {
    isHovering,
    isDragging,
    setIsDragging,
    hoveredTargetCoordinates,
    setSourceDimentions,
    setSelectedElement,
  } = useContext(DraggableContext);
  const [{ left, top, opacity }, draggedElementSpringApi] = useSpring<
    SpringValues<{
      left: number;
      top: number;
      opacity: number;
    }>
  >(() => ({
    left: 0,
    top: 0,
    opacity: 1,
    config: { mass: 5, tension: 2000, friction: 200 },
  }));

  useEffect(() => {
    isHovering &&
      isDragging === id &&
      draggedElementSpringApi.start({
        left: hoveredTargetCoordinates.x, // - offsetCoordinates.x,
        top: hoveredTargetCoordinates.y, // - offsetCoordinates.y,
      });
  }, [isHovering, isDragging, hoveredTargetCoordinates]);

  useEffect(() => {
    isDragging === id &&
      componentRef.current &&
      setSourceDimentions({
        width: componentRef.current?.clientWidth,
        height: componentRef.current?.clientHeight,
      });
  }, [isDragging]);

  function handleDragStartSource(event: DragEvent<HTMLElement>) {
    event.stopPropagation();
    setIsDragging(id);
    setSelectedElement(null);
    //eliminate initial animation from the top left of the screen
    draggedElementSpringApi.set({
      left: event.clientX,
      top: event.clientY,
      opacity: 0.8,
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
    //event.preventDefault();
    // event.stopPropagation();
    !isHovering &&
      draggedElementSpringApi.start({
        left: event.clientX, // - offsetCoordinates.x,
        top: event.clientY, // - offsetCoordinates.y,
      });
  };

  const handleDragEndSource = () => {
    setIsDragging(null);
    draggedElementSpringApi.start({
      left: 0,
      top: 0,
      opacity: 1,
    });
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
    <div ref={componentRef} style={{ ...props.style, position: 'relative' }}>
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
        <animated.div
          style={{
            // pointerEvents: 'none',
            opacity,
          }}
        >
          {props.children}
        </animated.div>
      </div>
      {isDragging === id && (
        <DraggaBleComponentActive style={{ left, top, opacity }}>
          {props.children}
        </DraggaBleComponentActive>
      )}
    </div>
  );
}

export default DraggableComponent;
