import React, { PropsWithChildren } from 'react';

export type testComponentProps = {
  todotask: string;
};

function TestComponent(props: PropsWithChildren<testComponentProps>) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#212e41',
        color: 'white',
        padding: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        margin: '5px',
      }}
    >
      <p>{`Task: ${props.todotask}`}</p>
      {props.children}
    </div>
  );
}

export default TestComponent;
