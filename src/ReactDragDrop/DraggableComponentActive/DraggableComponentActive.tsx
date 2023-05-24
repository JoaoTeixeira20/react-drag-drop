import { SpringValues, animated, useSpring } from '@react-spring/web';
import React, {
  PropsWithChildren,
  ReactElement,
  useContext,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { DraggableContext } from '../DraggableContext/DraggableContext';

function DraggaBleComponentActive(
  props: PropsWithChildren<{
    style: SpringValues<{ left: number; top: number; opacity: number }>;
  }>
): ReactElement {
  const { hoveredTargetCoordinates, isHovering } = useContext(DraggableContext);
  const elementRef = useRef<HTMLDivElement>(null);

  const spring = useSpring({
    width: isHovering
      ? hoveredTargetCoordinates.width
      : elementRef.current?.clientWidth,
    height: isHovering
      ? hoveredTargetCoordinates.height
      : elementRef.current?.clientHeight,
    config: { tension: 180, friction: 22 },
  });

  const domNode = document.getElementById('portal-draggable-element');

  return domNode ? (
    createPortal(
      <animated.div
        ref={elementRef}
        style={{
          position: 'fixed',
          top: props.style.top,
          left: props.style.left,
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
