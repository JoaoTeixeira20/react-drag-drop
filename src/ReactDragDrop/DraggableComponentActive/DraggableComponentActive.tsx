import { animated, useSpring } from '@react-spring/web';
import React, {
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { DraggableContext } from '../DraggableContext/DraggableContext';

function DraggaBleComponentActive(props: PropsWithChildren): ReactElement {
  const {
    isHovering,
    hoveredElementSize,
    setHoveredElementSize,
    draggedElementSpring: { left, top },
  } = useContext(DraggableContext);
  const elementRef = useRef<HTMLDivElement>(null);

  const spring = useSpring({
    width: isHovering
      ? hoveredElementSize.width
      : elementRef.current?.clientWidth,
    height: isHovering
      ? hoveredElementSize.height
      : elementRef.current?.clientHeight,
    config: { tension: 180, friction: 22, clamp: true },
  });

  useEffect(() => {
    /* 
      this initialization avoids the first hovered element to get an 
      initial shrinked sized animation that is not pretty to watch
    */
    elementRef.current &&
      setHoveredElementSize({
        width: elementRef.current?.clientWidth,
        height: elementRef.current?.clientHeight,
      });
  }, []);

  const domNode = document.getElementById('portal-draggable-element');

  return domNode ? (
    createPortal(
      <animated.div
        ref={elementRef}
        style={{
          position: 'fixed',
          top,
          left,
          pointerEvents: 'none',
          ...spring,
        }}
      >
        {props.children}
      </animated.div>,
      domNode
    )
  ) : (
    <div>{`failed to create draggable component.. :/`}</div>
  );
}

export default DraggaBleComponentActive;
