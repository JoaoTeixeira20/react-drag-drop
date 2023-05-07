import React, {
  PropsWithChildren,
  useState,
  createContext,
  useRef,
  MutableRefObject,
  SetStateAction,
  Dispatch,
} from 'react';
import { idType } from '../types/draggableLib.type';
import { ComponentType } from '@react-spring/web';
//@ts-expect-error
import iosDragDropShim from 'drag-drop-webkit-mobile';
import { addIdToElement } from '../helpers/helpers';
iosDragDropShim({
  enableEnterLeave: true,
  holdToDrag: 300,
  simulateAnchorClick: false,
  requireExplicitDraggable: true,
});

type DraggableContextProps<T> = {
  Component: ComponentType<T>;
  defaultComponentProps?: Record<keyof T, unknown>;
  elements: idType<T>[];
  setElements: Dispatch<SetStateAction<idType<T>[]>>;
  addElementWithId: (element: T, tableId: string) => void;
  isHovering: string | null;
  setIsHovering: Dispatch<SetStateAction<string | null>>;
  isDragging: string | null;
  setIsDragging: Dispatch<SetStateAction<string | null>>;
  sourceDimentions: { width: number; height: number };
  setSourceDimentions: Dispatch<
    SetStateAction<{ width: number; height: number }>
  >;
  selectedElementRef: MutableRefObject<HTMLElement | null>;
  hoveredTargetCoordinates: { x: number; y: number };
  setHoveredTargetCoordinates: Dispatch<
    SetStateAction<{ x: number; y: number }>
  >;
};

type DraggableContextProviderProps<T> = {
  Component: ComponentType<T>;
  defaultComponentProps?: Record<keyof T, unknown>;
};

const DraggableContext = createContext<DraggableContextProps<any>>(
  {} as DraggableContextProps<any>
);

const DraggableContextProvider = <T,>(
  props: PropsWithChildren<DraggableContextProviderProps<T>>
) => {
  const [elements, setElements] = useState<idType<T>[]>([]);
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [sourceDimentions, setSourceDimentions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const selectedElementRef = useRef<HTMLElement | null>(null);
  const [hoveredTargetCoordinates, setHoveredTargetCoordinates] = useState({
    x: 0,
    y: 0,
  });

  function addElementWithId(element: T, tableId: string) {
    setElements((prev) => [...prev, addIdToElement<T>(element, tableId)]);
  }

  const value = {
    Component: props.Component,
    defaultComponentProps: props.defaultComponentProps,
    elements,
    setElements,
    addElementWithId,
    isHovering,
    setIsHovering,
    isDragging,
    setIsDragging,
    sourceDimentions,
    setSourceDimentions,
    selectedElementRef,
    hoveredTargetCoordinates,
    setHoveredTargetCoordinates,
  };

  return (
    <DraggableContext.Provider value={value}>
      {props.children}
      <div id="portal-draggable-element"></div>
    </DraggableContext.Provider>
  );
};

export { DraggableContextProvider, DraggableContext };
