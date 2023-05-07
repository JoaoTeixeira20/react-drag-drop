import React from 'react';

export type contextTestComponentProps = {
    todotask: string
}

function ContextTestComponent(props: contextTestComponentProps) {
    return (<div style={{border: "1px solid black"}}>
        <div>todo task</div>
        <div>{props.todotask}</div>
    </div>)
}

export default ContextTestComponent;
