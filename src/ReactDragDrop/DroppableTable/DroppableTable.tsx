import { useTransition, animated } from '@react-spring/web';
import React, {
  ReactElement,
  Suspense,
  SyntheticEvent,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import DraggableComponent from '../DraggableComponent/DraggableComponent';
import DroppableSlot from '../DroppableSlot/DroppableSlot';
import { DraggableContext } from '../DraggableContext/DraggableContext';
import { actionType, idType } from '../types/draggableLib.type';
import { v4 as uuidv4 } from 'uuid';
import { addIdToElement } from '../helpers/helpers';

type TrashBasketProps = {
  width: number;
  height: number;
  color: string;
};

const TrashBasket = (
  props: TrashBasketProps = { width: 50, height: 50, color: 'black' }
): ReactElement<SVGElement> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
    width={props.width}
    height={props.height}
  >
    <path
      stroke={props.color}
      d="M20 18h2v16h-2zM24 18h2v16h-2zM28 18h2v16h-2zM12 12h26v2H12zM30 12h-2v-1c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v1h-2v-1c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3v1z"
    />
    <path
      stroke={props.color}
      d="M31 40H19c-1.6 0-3-1.3-3.2-2.9l-1.8-24 2-.2 1.8 24c0 .6.6 1.1 1.2 1.1h12c.6 0 1.1-.5 1.2-1.1l1.8-24 2 .2-1.8 24C34 38.7 32.6 40 31 40z"
    />
  </svg>
);

type droppableTable<T> = {
  tableId?: string;
  elements?: T[];
  action: actionType;
  enableDrop?: boolean;
};

function DroppableTable<T>(props: droppableTable<T>) {
  const tableId = useMemo(() => props.tableId || uuidv4(), []);
  const {
    elements,
    setElements,
    Component,
    isDragging,
    selectElement,
    selectedElement,
  } = useContext(DraggableContext);

  const enableDrop = useMemo(
    () => (isDragging === props.tableId ? false : props.enableDrop),
    [isDragging]
  );

  useEffect(
    () =>
      props.elements &&
      setElements((prev) => [
        ...prev,
        ...(props.elements
          ? props.elements.map((el) => addIdToElement<T>(el, tableId))
          : []),
      ]),
    []
  );
  //const idElements = useMemo(() => initialElements.map(addIdToElement), []);

  const transitions = useTransition(
    elements.filter((el) => el.tableId === tableId),
    {
      key: (element: idType<T>) => element.id,
      update: (element) => ({
        outlineWidth: element.id === selectedElement?.id ? '2px' : '0px',
        transform:
          element.id === selectedElement?.id
            ? `translateY(6px) scale(1.02)`
            : `translateY(0px) scale(1)`,
        backgroundColor:
          element.id === selectedElement?.id ? 'transparent' : 'transparent',
        boxShadow:
          element.id === selectedElement?.id
            ? '0px -6px 13px 0px rgba(238, 255, 0, 0.75), inset 0px -6px 13px 0px rgba(251, 255, 0, 0.75)'
            : '0px 0px 0px 0px rgba(238, 255, 0, 0.75), inset 0px 0px 0px 0px rgba(251, 255, 0, 0.75)',
      }),
      from: {
        //transform: 'perspective(600px) rotateX(180deg)',
        color: 'transparent',
        opacity: 0,
        // maxHeight: '0px',
        gridTemplateRows: '0fr',
        gridTemplateColumns: '0fr',
        outerWidth: '0px',
        transform: 'translateY(0px) scale(1)',
        boxShadow:
          '0px 0px 0px 0px rgba(238, 255, 0, 0.75), inset 0px 0px 0px 0px rgba(251, 255, 0, 0.75)',
      },
      enter: {
        //transform: 'perspective(600px) rotateX(0deg)',
        color: 'black',
        opacity: 1,
        //maxHeight: '500px',
        gridTemplateRows: '1fr',
        gridTemplateColumns: '1fr',
      },
      leave: {
        //transform: 'perspective(600px) rotateX(180deg)',
        color: 'transparent',
        opacity: 0,
        //maxHeight: '0px',
        gridTemplateRows: '0fr',
        gridTemplateColumns: '0fr',
      },
      config: { mass: 5, tension: 2000, friction: 200 },
    }
  );

  function handleRemove(event: SyntheticEvent<HTMLDivElement>) {
    event.stopPropagation();
    const id = event.currentTarget.dataset['id'] as string;
    setElements((prev) => prev.filter((element) => element.id !== id));
  }

  function selectElementHandler(event: SyntheticEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    const index = event.currentTarget.dataset['id'] || null;
    selectedElement?.id === index ? selectElement(null) : selectElement(index);
  }

  return (
    <div
      style={{
        all: 'inherit',
        position: 'relative',
        boxSizing: 'border-box',
        border: 'none',
        userSelect: 'none',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      {enableDrop && <DroppableSlot tableId={tableId} />}
      {transitions((style, element) => (
        <>
          <animated.div
            style={{
              display: 'grid',
              position: 'relative',
              ...style,
            }}
            data-id={element.id}
            onClick={selectElementHandler}
          >
            <DraggableComponent
              id={element.id}
              style={{ overflow: 'hidden' }}
              tableId={tableId}
              elementProps={element.item}
              action={props.action}
            >
              <Suspense fallback={<div>loading component...</div>}>
                <Component
                  {...(element.id === selectedElement?.id
                    ? selectedElement.item
                    : element.item)}
                >
                  <DroppableTable
                    action={props.action}
                    tableId={element.id}
                    enableDrop={enableDrop}
                  />
                </Component>
              </Suspense>
            </DraggableComponent>
            <div
              data-id={element.id}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                cursor: 'pointer',
              }}
              onClick={handleRemove}
            >
              <TrashBasket width={25} height={25} color="red" />
            </div>
          </animated.div>
          {enableDrop && <DroppableSlot id={element.id} tableId={tableId} />}
        </>
      ))}
    </div>
  );
}

DroppableTable.defaultProps = {
  enableDrop: true,
};

export default DroppableTable;
