import React, {
  DragEvent,
  Suspense,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { DraggableContext } from '../DraggableContext/DraggableContext';
import { v4 as uuidv4 } from 'uuid';

import { animated, useSpring } from '@react-spring/web';

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

  useEffect(() => {
    id === isHovering && console.log(elements.find((el) => el.id === isDragging)?.item);
  },[isHovering]);

  const spring = useSpring({
    //width: id === isHovering ? sourceDimentions.width : 100,
    // width: id === isHovering ? sourceDimentions.width : isDragging ? 30 : 0,
    // height:
    //   //check target hover to fit dragged element dimentions
    //   id === isHovering
    //     ? sourceDimentions.height
    //     : // don't highlight the current draggin position to drop
    //     isDragging
    //     ? 30
    //     : 0,
    gridTemplateRows: isDragging ? '1fr' : '0fr',
    gridTemplateColumns: isDragging ? '1fr' : '0fr',
    // scale: isDragging ? 1 : 0,
    // height: 15,
    // width: 15,
    onRest: () => {
      if (id === isHovering && hoveredElementRef.current && isDragging) {
        const { x, y, width, height } =
          hoveredElementRef.current?.getBoundingClientRect();
        setHoveredTargetCoordinates({ x, y, width, height });
      }
    },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

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
      const { x, y, width, height } =
        hoveredElementRef.current?.getBoundingClientRect();
      setHoveredTargetCoordinates({ x, y, width, height });
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
          // flexDirection: 'row',
          boxSizing: 'border-box',
          backgroundColor: 'orange',
          boxShadow: 'inset 0px -6px 13px 0px rgba(251, 255, 0, 0.75)',
          // borderRadius: '10px',
          border: '2px solid orange',
          //this values serves as droppable slots without index
          //springs are orchestrated on a map, if not fallback to this values
          ...spring,
        }}
        data-id={id}
        onDragEnter={handleDragEnterTarget}
        onDragOver={handleDragOverTarget}
        onDragLeave={handleDragLeaveTarget}
        onDrop={handleDropTarget}
      >
        <div
          style={{
            overflow: 'hidden',
            position: 'relative',
          }}
        >
            {id === isHovering ? (
              <div style={{pointerEvents:'none', position: 'relative'}}>
              <Suspense fallback={<div>loading component...</div>}>
                <Component
                  {...elements.find((el) => el.id === isDragging)?.item}
                ></Component>
              </Suspense>
              </div>
            ) : <p>cup</p>}
        </div>
      </animated.div>
    </div>
  );
}

export default DroppableSlot;
