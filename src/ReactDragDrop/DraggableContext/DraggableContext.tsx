import React, {
  PropsWithChildren,
  useState,
  createContext,
  SetStateAction,
  Dispatch,
} from 'react';
import { contextConfigType, idType } from '../types/draggableLib.type';
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
  BaseDragComponent: ComponentType<T>;
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
  selectedElement: idType<T> | null;
  setSelectedElement: Dispatch<SetStateAction<idType<T> | null>>;
  selectElement: (id: string | null) => void;
  submitEditedElement: () => void;
  config?: contextConfigType,
};

type DraggableContextProviderProps<T> = {
  BaseDragComponent: ComponentType<T>;
  defaultComponentProps?: Record<keyof T, unknown>;
  config?: contextConfigType,
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
    childMinWidth: isDragging ? props.config?.droppableSlotSize.width : 0,
    childMinHeigth: isDragging ? props.config?.droppableSlotSize.height : 0,
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
    BaseDragComponent: props.BaseDragComponent,
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
    hoveredElementSize,
    setHoveredElementSize,
    selectedElement,
    setSelectedElement,
    selectElement,
    submitEditedElement,
    config: props.config,
  };

  return (
    <DraggableContext.Provider value={value}>
      {props.children}
      <div id="portal-draggable-element"></div>
    </DraggableContext.Provider>
  );
};

const defaultProps: DraggableContextProviderProps<{foo: string, bar: string}> = {
  BaseDragComponent: ((props) => <div>{`foo: ${props.foo} bar: ${props.bar}`}</div>),
  config: {
    droppableSlotSize: {
      height: 25,
      width: 25,
    }
  },
  defaultComponentProps: {
    foo: 'samplefoo',
    bar: 'samplebar',
  }
}

DraggableContextProvider.defaultProps = defaultProps;

export { DraggableContextProvider, DraggableContext };
