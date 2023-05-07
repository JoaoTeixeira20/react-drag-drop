import { SpringValues, animated } from '@react-spring/web';
import React, {
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { DraggableContext } from '../DraggableContext/DraggableContext';

function DraggaBleComponentActive(
  props: PropsWithChildren<{
    style: SpringValues<{ left: number; top: number; opacity: number }>;
  }>
): ReactElement {
  const { setSourceDimentions } = useContext(DraggableContext);
  const divSizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSourceDimentions({
      width: divSizeRef.current?.clientWidth || 100,
      height: divSizeRef.current?.clientHeight || 100,
    });
  }, []);

  const domNode = document.getElementById('portal-draggable-element');

  return domNode ? (
    createPortal(
      <animated.div
        ref={divSizeRef}
        style={{
          position: 'absolute',
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
