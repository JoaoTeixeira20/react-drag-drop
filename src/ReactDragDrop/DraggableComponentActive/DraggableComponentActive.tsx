import { SpringValues, animated } from '@react-spring/web';
import React, { PropsWithChildren, ReactElement, useContext } from 'react';
import { createPortal } from 'react-dom';
import { DraggableContext } from '../DraggableContext/DraggableContext';

function DraggaBleComponentActive(
  props: PropsWithChildren<{
    style: SpringValues<{ left: number; top: number; opacity: number }>;
  }>
): ReactElement {

  const { hoveredTargetCoordinates } = useContext(DraggableContext);

  const domNode = document.getElementById('portal-draggable-element');

  return domNode ? (
    createPortal(
      <animated.div
        style={{
          position: 'fixed',
          top: props.style.top,
          left: props.style.left,
          pointerEvents: 'none',
          width: hoveredTargetCoordinates.width || 'auto',
          height: hoveredTargetCoordinates.height || 'auto',
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
