import React, {
  DragEvent,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { DraggableContext } from '../DraggableContext/DraggableContext';
import { v4 as uuidv4 } from 'uuid';

import { animated, useTransition } from '@react-spring/web';
import DroppableTable from '../DroppableTable/DroppableTable';
import { asyncGetBoundingClientRect, debounce } from '../helpers/helpers';

type DroppableSlotProps = {
  id?: string;
  tableId: string;
};

function DroppableSlot<T>(props: DroppableSlotProps) {
  const id = useMemo(() => props.id || uuidv4(), []);
  const {
    elements,
    setElements,
    isDragging,
    setIsDragging,
    isHovering,
    setIsHovering,
    hoveredElementRef,
    setHoveredElementSize,
    Component,
    draggedElementSpringApi,
    droppableHighlightSpring,
  } = useContext(DraggableContext);

  const resizedRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const transitions = useTransition(
    id === isHovering ? elements.find((el) => el.id === isDragging) : [],
    {
      from: {
        gridTemplateRows: '0fr',
        gridTemplateColumns: '0fr',
      },
      enter: {
        gridTemplateRows: '1fr',
        gridTemplateColumns: '1fr',
      },
      leave: {
        gridTemplateRows: '0fr',
        gridTemplateColumns: '0fr',
      },
      config: { mass: 1, tension: 180, friction: 12, clamp: true },
    }
  );

  useEffect(() => {
    if (id === isHovering && isDragging) {
      if (!resizeObserverRef.current) {
        resizeObserverRef.current = new ResizeObserver(
          debounce((entries: ResizeObserverEntry[]) => {
            const { width, height } = entries[0].contentRect;
            setHoveredElementSize({ width: width, height: height });
            if (resizedRef.current) {
              asyncGetBoundingClientRect(resizedRef.current).then(
                ({ x, y }) => {
                  draggedElementSpringApi.start({ left: x, top: y });
                }
              );
            }
          }, 20)
        );
        resizeObserverRef.current.observe(
          resizedRef.current as unknown as Element
        );
      }
      return;
    }
    if (resizeObserverRef.current) {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      return;
    }
  }, [isHovering]);

  function handleDragOverTarget(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!isHovering) {
      setIsHovering(event.currentTarget.dataset['id'] || null);
    }
  }

  function handleDragLeaveTarget(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsHovering(null);
  }

  function handleDragEnterTarget(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsHovering(id);
    hoveredElementRef.current = event.currentTarget;
  }

  function handleDropTarget(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(null);
    setIsHovering(null);
    hoveredElementRef.current = null;
    const elementDropped = event.dataTransfer.getData('componentProps');
    const draggedId = event.dataTransfer.getData('id');
    const droppedId = event.currentTarget.dataset['id'] as string;
    const action = event.dataTransfer.getData('action');
    const index = elements.map((element) => element.id).indexOf(droppedId);
    const element = JSON.parse(elementDropped) as T;
    const newId = uuidv4();
    elements.splice(index + 1, 0, {
      id: newId,
      tableId: props.tableId,
      item: element,
    });
    const newEls = elements.map((el) =>
      el.tableId === draggedId ? { ...el, tableId: newId } : el
    );
    if (action === 'move') {
      setElements(newEls.filter((element) => element.id !== draggedId));
      return;
    }
    setElements(newEls);
  }

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <animated.div
        style={{
          display: 'grid',
          position: 'relative',
          boxSizing: 'border-box',
          backgroundColor: 'orange',
          boxShadow: 'inset 0px -6px 13px 0px rgba(251, 255, 0, 0.75)',
          gridTemplateRows: droppableHighlightSpring.parentGridTemplateRows,
          gridTemplateColumns: droppableHighlightSpring.parentGridTemplateColumns,
        }}
        data-id={id}
        ref={resizedRef}
        onDragEnter={handleDragEnterTarget}
        onDragOver={handleDragOverTarget}
        onDragLeave={handleDragLeaveTarget}
        onDrop={handleDropTarget}
      >
        <animated.div
          style={{
            overflow: 'hidden',
            position: 'relative',
            pointerEvents: 'none',
            minWidth: droppableHighlightSpring.childMinWidth,
            minHeight: droppableHighlightSpring.childMinHeigth,
          }}
        >
          {transitions((style, element) => (
            <animated.div
              style={{
                display: 'grid',
                ...style,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: 0,
                }}
              >
                <Suspense fallback={<div>loading component...</div>}>
                  <Component {...element?.item}>
                    <DroppableTable
                      action={'move'}
                      tableId={element?.id}
                      enableDrop={false}
                    ></DroppableTable>
                  </Component>
                </Suspense>
              </div>
            </animated.div>
          ))}
        </animated.div>
      </animated.div>
    </div>
  );
}

export default DroppableSlot;
