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
import { polyfill } from 'mobile-drag-drop';
import { addIdToElement } from '../helpers/helpers';
polyfill({});

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
  hoveredElementRef: MutableRefObject<HTMLElement | null>;
  hoveredTargetCoordinates: { x: number; y: number };
  setHoveredTargetCoordinates: Dispatch<
    SetStateAction<{ x: number; y: number; width: number, height: number }>
  >;
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
  const [hoveredTargetCoordinates, setHoveredTargetCoordinates] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [selectedElement, setSelectedElement] = useState<idType<T> | null>(
    null
  );

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

  // useEffect(() => {
  //   if(hoveredTargetCoordinates.width !== sourceDimentions.width){
  //     setSourceDimentions((prev) => ({
  //       ...prev,
  //       width: hoveredTargetCoordinates.width,
  //     }));
  //   };
  // }, [hoveredTargetCoordinates]);

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
    hoveredElementRef,
    hoveredTargetCoordinates,
    setHoveredTargetCoordinates,
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
