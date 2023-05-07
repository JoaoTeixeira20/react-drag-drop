import React, {
  DragEvent,
  useContext,
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
  const id = useMemo(() => props.id || uuidv4(),[]);
  const {
    elements,
    setElements,
    isDragging,
    setIsDragging,
    isHovering,
    setIsHovering,
    sourceDimentions,
    selectedElementRef,
    setHoveredTargetCoordinates,
  } = useContext(DraggableContext);

  const spring = useSpring({
      //width: id === isHovering ? sourceDimentions.width : 100,
      //width: sourceDimentions.width,
      height:
      //check target hover to fit dragged element dimentions
        id === isHovering
          ? sourceDimentions.height
          // don't highlight the current draggin position to drop
          : isDragging && isDragging !== id
          ? 20
          : 0,
      scaleY: isDragging ? 1 : 0,
      onRest: () => {
        if (
          id === isHovering &&
          selectedElementRef.current &&
          isDragging
        ) {
          const { x, y } = selectedElementRef.current?.getBoundingClientRect();
          setHoveredTargetCoordinates({ x, y });
        }
      },
      config: { mass: 5, tension: 2000, friction: 200 },
    })

    function handleDragOverTarget(event: DragEvent<HTMLElement>) {
      event.preventDefault();
      event.stopPropagation();
      if(!isHovering) {
        setIsHovering(event.currentTarget.dataset["id"] || null);
      };
      //event.dataTransfer.effectAllowed = 'move';
    }

    function handleDragLeaveTarget(event: DragEvent<HTMLElement>) {
      event.preventDefault();
      event.stopPropagation();

      setIsHovering(null);
    }

    function handleDragEnterTarget(event: DragEvent<HTMLElement>) {
      event.preventDefault();
      // event.stopPropagation();
      selectedElementRef.current = event.currentTarget;
      if (selectedElementRef.current) {
        // check onRest callback on useSprings that corrects the correct snap value
        // if the animation didn't end and the snap got incorrect
        // also this cripples performance, need to refactor to an intersection observer
        // approach insted of getBoundingClientRect
        setIsHovering(selectedElementRef.current.dataset['id'] as string);
        const { x, y } = selectedElementRef.current?.getBoundingClientRect();
        setHoveredTargetCoordinates({ x, y });
      }
    }

  function handleDropTarget(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    // event.stopPropagation();
    setIsDragging(null);
    setIsHovering(null);
    selectedElementRef.current = null;
    const elementDropped = event.dataTransfer.getData('componentProps');
    const draggedId = event.dataTransfer.getData('id');
    // const draggedTableId = event.dataTransfer.getData('tableId');
    const droppedId = event.currentTarget.dataset['id'] as string;
    //const action = event.dataTransfer.effectAllowed;
    const action = event.dataTransfer.getData('action');
    const index = elements.map((element) => element.id).indexOf(droppedId);
    const element = JSON.parse(elementDropped) as T
    elements.splice(index + 1, 0, {
      id: uuidv4(),
      tableId: props.tableId,
      item: element,
    });
    if (action === 'move') {
      setElements(
        elements.filter((element) => element.id !== draggedId)
      );
      return;
    }
    setElements([...elements]);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <animated.div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: "100%",
          //this values serves as droppable slots without index
          //springs are orchestrated on a map, if not fallback to this values
          //@ts-expect-error
          scaleY: 0,
          //@ts-expect-error
          height: 0,
          ...spring,
        }}
        data-id={id}
        onDragEnter={handleDragEnterTarget}
        onDragOver={handleDragOverTarget}
        onDragLeave={handleDragLeaveTarget}
        onDrop={handleDropTarget}
      >
      </animated.div>
    </div>
  );
}

export default DroppableSlot;
