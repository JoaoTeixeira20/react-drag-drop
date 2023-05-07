import { DraggableContext } from '@/ReactDragDrop/DraggableContext/DraggableContext';
import React, { ChangeEvent, SyntheticEvent, useContext, useState } from 'react';

type testAddComponentProps ={
  tables: string[]
}

function TestAddComponent(props: testAddComponentProps) {
  const { defaultComponentProps, addElementWithId } = useContext(DraggableContext);
  const [inputs, setInputs] = useState<
    Record<string | number | symbol, unknown>
  >(defaultComponentProps || {});
  const [tableId, setTableId ] = useState<string>("todo");

  const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
    const index = event.currentTarget.dataset["label"] as string;
    const value = event.currentTarget.value || "";
    index && setInputs((prev) => ({...prev, [index]:value}));
  }

  const handleSubmit = () => {
    tableId ? addElementWithId(inputs, tableId) : alert("add a table id");
  }

  const handleTableIdChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    setTableId(event.currentTarget.value);
  }

  return (
    <div>
      {defaultComponentProps && Object.keys(defaultComponentProps).map((el, index) => (
        <div key={index}>
          <label>{el}</label>
          <input
            type="text"
            data-label={el}
            onChange={handleChange}
            value={inputs[el] as string || ""}
          ></input>
        </div>
      ))}
      <label>table id</label>
      <select value={tableId} onChange={handleTableIdChange}>
        {props.tables.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
      <input type="button" onClick={handleSubmit} value={'add element'}></input>
    </div>
  );
}

export default TestAddComponent;
