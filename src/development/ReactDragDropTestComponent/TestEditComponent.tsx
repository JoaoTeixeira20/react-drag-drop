import { DraggableContext } from '@/ReactDragDrop/DraggableContext/DraggableContext';
import React, { ChangeEvent, useContext } from 'react';

function TestEditComponent() {
  const { selectedElement, setSelectedElement, submitEditedElement } = useContext(DraggableContext);

  const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
    const index = event.currentTarget.dataset["label"];
    const value = event.currentTarget.value || "";
    index && setSelectedElement((prev) => (prev && {...prev, item: {...prev?.item, [index] : value}}));
  }

  const handleSubmit = () => {
    submitEditedElement();
  }

  return (
    <div>
      {selectedElement?.item && Object.keys(selectedElement.item).map((el, index) => (
        <div key={index}>
          <label>{el}</label>
          <input
            type="text"
            data-label={el}
            onChange={handleChange}
            value={selectedElement.item[el] as string || ""}
          ></input>
          <input type="button" onClick={handleSubmit} value={'add element'}></input>
        </div>
      ))}
    </div>
  );
}

export default TestEditComponent;
