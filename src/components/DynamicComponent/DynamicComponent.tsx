import React, {
  ReactElement,
  lazy,
  Suspense,
  useState,
  SyntheticEvent,
  useDeferredValue,
} from 'react';

import * as S from './DynamicComponent.style';

const TransitionComponentLazy = lazy(() => import('@/components/TransitionComponent/TransitionComponent'))

const sentence = 'youarelit'

const DynamicComponent = (): ReactElement => {
  const [message, setMessage] = useState<string>(sentence);

  const deferredValue = useDeferredValue(message);

  const handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setMessage(event.currentTarget?.value || '');
  };

  return (
    <S.Container>
      <input
        type="text"
        value={message}
        onChange={handleChange}
        style={{ maxWidth: '500px' }}
      ></input>
      <Suspense fallback={<div>loading...</div>}>
      <TransitionComponentLazy content={deferredValue} />
      </Suspense>
    </S.Container>
  );
};

export default DynamicComponent;
