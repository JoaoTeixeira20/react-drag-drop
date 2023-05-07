import { DraggableContextProvider } from '@/ReactDragDrop/DraggableContext/DraggableContext';
import React, { lazy } from 'react';
import { contextTestComponentProps } from './TestComponent';
import DroppableTable from '@/ReactDragDrop/DroppableTable/DroppableTable';
import TestAddComponent from './TestAddComponent';
const Component = lazy(
  () => import('@/development/ReactDragDropTestComponent/TestComponent')
);

const tables = ["todo", "in progress", "done"]

function ContextTestDrag() {
  return (
    <DraggableContextProvider<contextTestComponentProps>
      Component={Component}
      defaultComponentProps={{ todotask: 'foo' }}
    >
      <TestAddComponent tables={tables}/>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', textAlign: 'center' }}>
      {tables.map((table, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
        <h1>{table}</h1>
        <DroppableTable tableId={table} action='move' />
      </div>
      ))}
      </div>
    </DraggableContextProvider>
  );
}

export default ContextTestDrag;
