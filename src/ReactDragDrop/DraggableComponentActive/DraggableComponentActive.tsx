import { animated, useSpring } from '@react-spring/web';
import React, {
  PropsWithChildren,
  ReactElement,
  useContext,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { DraggableContext } from '../DraggableContext/DraggableContext';

function DraggaBleComponentActive(props: PropsWithChildren): ReactElement {
  const {
    isHovering,
    hoveredElementRef,
    draggedElementSpring: { left, top, opacity },
  } = useContext(DraggableContext);
  const elementRef = useRef<HTMLDivElement>(null);

  const spring = useSpring({
    width: isHovering
      ? hoveredElementRef.current?.clientWidth
      : elementRef.current?.clientWidth,
    height: isHovering
      ? hoveredElementRef.current?.clientHeight 
      : elementRef.current?.clientHeight,
    config: { tension: 180, friction: 22, clamp: true },
  });

  const domNode = document.getElementById('portal-draggable-element');

  return domNode ? (
    createPortal(
      <animated.div
        ref={elementRef}
        style={{
          position: 'fixed',
          top,
          left,
          opacity,
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
