import React, { DragEvent, Suspense, useContext, useMemo } from 'react';
import { DraggableContext } from '../DraggableContext/DraggableContext';
import { v4 as uuidv4 } from 'uuid';

import { animated, useSpring, useTransition } from '@react-spring/web';

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
    setHoveredTargetCoordinates,
    Component,
  } = useContext(DraggableContext);

  const spring = useSpring({
    parentGridTemplateRows: isDragging ? '1fr' : '0fr',
    parentGridTemplateColumns: isDragging ? '1fr' : '0fr',
    childMinWidth: isDragging ? 25 : 0,
    childMinHeigth: isDragging ? 25 : 0,
    // onRest: () => {
    //   if (id === isHovering && hoveredElementRef.current && isDragging) {
    //     const { x, y, width, height } =
    //       hoveredElementRef.current?.getBoundingClientRect();
    //     setHoveredTargetCoordinates({ x, y, width, height });
    //   }
    // },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  const transitions = useTransition(
    id === isHovering ? elements.find((el) => el.id === isDragging)?.item : [],
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
      onRest: () => {
        if (id === isHovering && hoveredElementRef.current && isDragging) {
          const { x, y, width, height } =
            hoveredElementRef.current?.getBoundingClientRect();
          setHoveredTargetCoordinates({ x, y, width, height });
        }
      },
      config: { mass: 1, tension: 180, friction: 12, clamp: true },
    }
  );

  function handleDragOverTarget(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!isHovering) {
      setIsHovering(event.currentTarget.dataset['id'] || null);
    }
    //event.dataTransfer.effectAllowed = 'move';
  }

  function handleDragLeaveTarget(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsHovering(null);
  }

  function handleDragEnterTarget(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    // event.stopPropagation();
    hoveredElementRef.current = event.currentTarget;
    if (hoveredElementRef.current) {
      // check onRest callback on useSprings that corrects the correct snap value
      // if the animation didn't end and the snap got incorrect
      // also this cripples performance, need to refactor to an intersection observer
      // approach insted of getBoundingClientRect
      setIsHovering(hoveredElementRef.current.dataset['id'] as string);
      // const { x, y, width, height } =
      //   hoveredElementRef.current?.getBoundingClientRect();
      // setHoveredTargetCoordinates({ x, y, width, height });
    }
  }

  function handleDropTarget(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    // event.stopPropagation();
    setIsDragging(null);
    setIsHovering(null);
    hoveredElementRef.current = null;
    const elementDropped = event.dataTransfer.getData('componentProps');
    const draggedId = event.dataTransfer.getData('id');
    // const draggedTableId = event.dataTransfer.getData('tableId');
    const droppedId = event.currentTarget.dataset['id'] as string;
    //const action = event.dataTransfer.effectAllowed;
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
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <animated.div
        style={{
          display: 'grid',
          position: 'relative',
          boxSizing: 'border-box',
          backgroundColor: 'orange',
          boxShadow: 'inset 0px -6px 13px 0px rgba(251, 255, 0, 0.75)',
          gridTemplateRows: spring.parentGridTemplateRows,
          gridTemplateColumns: spring.parentGridTemplateColumns,
        }}
        data-id={id}
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
            minWidth: spring.childMinWidth,
            minHeight: spring.childMinHeigth,
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
                  <Component {...element}></Component>
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
