import { animated, useTrail } from '@react-spring/web';
import React, { ReactElement, useEffect, useRef } from 'react';

export type SampleComponentProps = {
  content: string;
};

const SampleComponent = (props: SampleComponentProps): ReactElement => {
  const elements = props.content.split('');
  const loopTimer = 280 * elements.length > 1500 ? 280 * elements.length : 1500;

  const [trail, api] = useTrail(elements.length, () => ({
    transform: 'perspective(600px) rotateX(0deg)',
    backgroundColor: '#747899',
    color: 'black',
  }));

  const isFlipped = useRef(false);

  const loopFunc = () => {
    if (!isFlipped.current) {
      api.start({
        color: 'transparent',
        transform: 'perspective(600px) rotateX(180deg)',
        backgroundColor: '#789974',
      });
      isFlipped.current = true;
    } else {
      api.start({
        color: 'black',
        transform: 'perspective(600px) rotateX(0deg)',
        backgroundColor: '#747899',
      });
      isFlipped.current = false;
    }
  };

  useEffect(() => {
    const interval = setInterval(loopFunc, loopTimer);
    const unmount = () => clearInterval(interval);
    isFlipped.current = false;
    return unmount;
  }, [props.content]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '500px',
        height: '500px',
        flexWrap: 'wrap',
      }}
    >
      {trail.map((style, i) => {
        return (
          <animated.div
            style={{
              width: '100%',
              maxHeight: '200px',
              flex: '0 0 33.333333%',
              outline: '1px solid black',
              transformStyle: 'preserve-3d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: "25px",
              fontWeight: "bold",
              ...style,
            }}
            key={i}
          >
            <p>{`${elements[i]}`}</p>
          </animated.div>
        );
      })}
    </div>
  );
};

export default SampleComponent;
