import { SpringValues, animated } from '@react-spring/web';
import React, { PropsWithChildren, ReactElement } from 'react';
import { createPortal } from 'react-dom';

function DraggaBleComponentActive(
  props: PropsWithChildren<{
    style: SpringValues<{ left: number; top: number; opacity: number }>;
  }>
): ReactElement {

  const domNode = document.getElementById('portal-draggable-element');

  return domNode ? (
    createPortal(
      <animated.div
        style={{
          position: 'fixed',
          top: props.style.top,
          left: props.style.left,
          pointerEvents: 'none',
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
