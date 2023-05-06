import {
  animated,
  useTransition,
  config as SpringConfig,
} from '@react-spring/web';
import React, { ReactElement } from 'react';

export type TransitionComponentProps = {
  content: string;
};

const TransitionComponent = (props: TransitionComponentProps): ReactElement => {
  const elements = props.content.split('');

  const transitions = useTransition(elements, {
    from: {
      transform: 'perspective(600px) rotateX(180deg)',
      backgroundColor: '#747899',
      color: 'transparent',
      opacity: 0,
      height: '0px',
    },
    enter: {
      transform: 'perspective(600px) rotateX(0deg)',
      backgroundColor: '#789974',
      color: 'black',
      opacity: 1,
      height: '100px',
    },
    leave: {
      transform: 'perspective(600px) rotateX(180deg)',
      backgroundColor: '#747899',
      color: 'transparent',
      opacity: 0,
      height: '0px',
    },
    key: (_: string, index: number) => index,
    config: SpringConfig.wobbly,
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '500px',
        height: 'fit-content',
        border: "1px solid black",
        flexWrap: 'wrap',
        padding: "10px",
        gap: "3px",
        borderRadius: "3px",
        boxSizing: "border-box",
      }}
    >
      {transitions((style, item) => (
          <animated.div
            style={{
              width: '100%',
              flex: '0 0 calc(33.333333% - 3px)',
              outline: '1px solid black',
              transformStyle: 'preserve-3d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: "25px",
              fontWeight: 'bold',
              ...style,
            }}
          >
            <p>{item.toUpperCase()}</p>
          </animated.div>
      ))}
    </div>
  );
};

export default TransitionComponent;
