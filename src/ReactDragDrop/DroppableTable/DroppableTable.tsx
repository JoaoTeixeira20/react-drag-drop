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
};

function DroppableTable<T>(props: droppableTable<T>) {
  const tableId = useMemo(() => props.tableId || uuidv4(), []);
  const { elements, setElements, Component } = useContext(DraggableContext);

  useEffect(
    () =>
      props.elements &&
      setElements((prev) => [
        ...prev,
        ...(props.elements ? props.elements.map((el) => addIdToElement<T>(el, tableId)) : []),
      ]),
    []
  );
  //const idElements = useMemo(() => initialElements.map(addIdToElement), []);

  const tableElements = useMemo(
    () => elements.filter((el) => el.tableId === tableId),
    [elements]
  );

  const transitions = useTransition(
    tableElements.filter((el) => el.tableId === tableId),
    {
      key: (element: idType<T>) => element.id,
      from: {
        //transform: 'perspective(600px) rotateX(180deg)',
        color: 'transparent',
        opacity: 0,
        // maxHeight: '0px',
        gridTemplateRows: '0fr',
      },
      enter: {
        //transform: 'perspective(600px) rotateX(0deg)',
        color: 'black',
        opacity: 1,
        //maxHeight: '500px',
        gridTemplateRows: '1fr',
      },
      leave: {
        //transform: 'perspective(600px) rotateX(180deg)',
        color: 'transparent',
        opacity: 0,
        //maxHeight: '0px',
        gridTemplateRows: '0fr',
      },
      config: { mass: 5, tension: 2000, friction: 200 },
    }
  );

  function handleRemove(event: SyntheticEvent<HTMLDivElement>) {
    event.stopPropagation();
    const id = event.currentTarget.dataset['id'] as string;
    setElements((prev) => prev.filter((element) => element.id !== id));
  }

  function gimmeTheProps(event: SyntheticEvent<HTMLElement>) {
    const index = event.currentTarget.dataset['id'];
    console.log(elements.find((el) => el.id === index)?.item);
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        userSelect: 'none',
      }}
    >
      <DroppableSlot tableId={tableId} />
      {transitions((style, element) => (
        <animated.div
          style={{
            display: 'grid',
            position: 'relative',
            ...style,
          }}
          data-id={element.id}
          onClick={gimmeTheProps}
        >
          <DraggableComponent
            id={element.id}
            style={{ overflow: 'hidden' }}
            tableId={tableId}
            elementProps={element.item}
            action={props.action}
          >
            <Suspense fallback={<div>loading component...</div>}>
              <Component {...element.item} >
              {/* test this out */}
              <DroppableTable action={props.action} tableId={element.id}/>
              </Component>
            </Suspense>
          </DraggableComponent>
          <DroppableSlot id={element.id} tableId={tableId} />
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
      ))}
    </div>
  );
}

export default DroppableTable;
