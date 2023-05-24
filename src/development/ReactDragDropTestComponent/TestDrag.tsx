import { DraggableContextProvider } from '@/ReactDragDrop/DraggableContext/DraggableContext';
import React, { lazy } from 'react';
import { testComponentProps } from './TestComponent';
import DroppableTable from '@/ReactDragDrop/DroppableTable/DroppableTable';
import TestAddComponent from './TestAddComponent';
import { tableElements } from './tableElements';
const Component = lazy(
  () => import('@/development/ReactDragDropTestComponent/TestComponent')
);

import './testdrag.css';
import TestEditComponent from './TestEditComponent';

function ContextTestDrag() {
  return (
    <DraggableContextProvider<testComponentProps>
      Component={Component}
      defaultComponentProps={{ todotask: 'foo', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TestAddComponent tables={tableElements.map((el) => el.tableId)} />
        <TestEditComponent />
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-around',
          textAlign: 'center',
          //fontFamily: "'Trebuchet MS', Consolas, Open-Sans, Helvetica, Sans-Serif, monospace",
          //fontWeight: 'bold',
        }}
      >
        {tableElements.map((table, index) => (
          <div
            key={index}
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            <h1>{table.tableId}</h1>
            <div style={{ backgroundColor: '#3A94F6' }}>
              <DroppableTable
                tableId={table.tableId}
                action={table.action}
                elements={table.elements}
              />
            </div>
          </div>
        ))}
      </div>
    </DraggableContextProvider>
  );
}

export default ContextTestDrag;
