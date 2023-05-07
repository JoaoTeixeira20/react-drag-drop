import { actionType } from "@/ReactDragDrop/types/draggableLib.type";
import { testComponentProps } from "./TestComponent";

type tableElementsType = {
    tableId: string;
    action: actionType;
    elements: testComponentProps[];
  };

export const tableElements: tableElementsType[] = [
    {
      tableId: 'todo',
      action: 'move',
      elements: [
        { todotask: 'jest unit tests' },
        { todotask: 'documentation' },
        { todotask: 'performance memoization of the context' },
        { todotask: 'firefox drag coordinates fix' },
        { todotask: 'browser and device compatibility test' },
        { todotask: 'ability to select and edit current element' },
        { todotask: 'intern table id duplicate control' },
        { todotask: 'drag scrolling'},
      ],
    },
    {
      tableId: 'in progress',
      action: 'move',
      elements: [{ todotask: 'recursive drag and drop elements' }],
    },
    {
      tableId: 'done',
      action: 'move',
      elements: [
        { todotask: 'multi table drag and drop' },
        { todotask: 'drag actions (copy/move)' },
        { todotask: 'animated dragged element' },
        { todotask: 'dragged element positioning' },
        { todotask: 'drop highlight animation' },
        { todotask: 'swapping positions animation' },
        { todotask: 'touch device compatibility' },
        { todotask: 'drop dimention component auto-fit' },
        { todotask: 'dragged component abstraction and adptability' },
        { todotask: 'event delegation fixes on drag events' },
      ],
    },
  ];