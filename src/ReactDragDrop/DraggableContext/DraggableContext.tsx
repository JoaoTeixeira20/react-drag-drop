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
import {
  ComponentType,
  SpringRef,
  SpringValues,
  useSpring,
} from '@react-spring/web';
import { polyfill } from 'mobile-drag-drop';
import { addIdToElement } from '../helpers/helpers';
polyfill({});

type DraggableContextProps<T> = {
  Component: ComponentType<T>;
  draggedElementSpring: SpringValues<{
    left: number;
    top: number;
  }>;
  draggedElementSpringApi: SpringRef<{
    left: number;
    top: number;
  }>;
  droppableHighlightSpring: SpringValues<{
    parentGridTemplateRows: string,
    parentGridTemplateColumns: string,
    childMinWidth: number,
    childMinHeigth: number,
  }>;
  defaultComponentProps?: Record<keyof T, unknown>;
  elements: idType<T>[];
  setElements: Dispatch<SetStateAction<idType<T>[]>>;
  addElementWithId: (element: T, tableId: string) => void;
  isHovering: string | null;
  setIsHovering: Dispatch<SetStateAction<string | null>>;
  hoveredElementSize: { width: number; height: number };
  setHoveredElementSize: Dispatch<
    SetStateAction<{ width: number; height: number }>
  >;
  isDragging: string | null;
  setIsDragging: Dispatch<SetStateAction<string | null>>;
  hoveredElementRef: MutableRefObject<HTMLElement | null>;
  selectedElement: idType<T> | null;
  setSelectedElement: Dispatch<SetStateAction<idType<T> | null>>;
  selectElement: (id: string | null) => void;
  submitEditedElement: () => void;
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
  const hoveredElementRef = useRef<HTMLElement | null>(null);
  const [hoveredElementSize, setHoveredElementSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [selectedElement, setSelectedElement] = useState<idType<T> | null>(
    null
  );

  const [draggedElementSpring, draggedElementSpringApi] = useSpring<
    SpringValues<{
      left: number;
      top: number;
    }>
  >(() => ({
    left: 0,
    top: 0,
    opacity: 1,
    config: { mass: 5, tension: 2000, friction: 200 },
  }));

  const droppableHighlightSpring = useSpring<SpringValues<{
    parentGridTemplateRows: string,
    parentGridTemplateColumns: string,
    childMinWidth: number,
    childMinHeigth: number,
  }>>({
    parentGridTemplateRows: isDragging ? '1fr' : '0fr',
    parentGridTemplateColumns: isDragging ? '1fr' : '0fr',
    childMinWidth: isDragging ? 25 : 0,
    childMinHeigth: isDragging ? 25 : 0,
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  function addElementWithId(element: T, tableId: string) {
    setElements((prev) => [...prev, addIdToElement<T>(element, tableId)]);
  }

  function selectElement(id: string | null): void {
    setSelectedElement(elements.find((el) => id === el.id) || null);
  }

  function submitEditedElement(): void {
    selectedElement &&
      setElements((prev) =>
        prev.map((el) => (el.id === selectedElement.id ? selectedElement : el))
      );
    setSelectedElement(null);
  }

  const value = {
    Component: props.Component,
    draggedElementSpring,
    draggedElementSpringApi,
    droppableHighlightSpring,
    defaultComponentProps: props.defaultComponentProps,
    elements,
    setElements,
    addElementWithId,
    isHovering,
    setIsHovering,
    isDragging,
    setIsDragging,
    hoveredElementRef,
    hoveredElementSize,
    setHoveredElementSize,
    selectedElement,
    setSelectedElement,
    selectElement,
    submitEditedElement,
  };

  return (
    <DraggableContext.Provider value={value}>
      {props.children}
      <div id="portal-draggable-element"></div>
    </DraggableContext.Provider>
  );
};

export { DraggableContextProvider, DraggableContext };
