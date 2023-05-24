import { actionType } from '@/ReactDragDrop/types/draggableLib.type';
import { testComponentProps } from './TestComponent';

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
      { todotask: 'jest unit tests', flexDirection: 'column' },
      { todotask: 'documentation', flexDirection: 'column' },
      {
        todotask: 'performance memoization of the context',
        flexDirection: 'column',
      },
      { todotask: 'firefox drag coordinates fix', flexDirection: 'column' },
      {
        todotask: 'browser and device compatibility test',
        flexDirection: 'column',
      },
      {
        todotask: 'intern table id duplicate control',
        flexDirection: 'column',
      },
      { todotask: 'drag scrolling fix on mobile', flexDirection: 'column' },
    ],
  },
  {
    tableId: 'progress',
    action: 'move',
    elements: [
      {todotask: 'delete child elements on parent removal', flexDirection: 'column' },
      {todotask: 'fix snap element overflow size on text wrap', flexDirection: 'column' },
    ],
  },
  {
    tableId: 'done',
    action: 'move',
    elements: [
      {
        todotask: 'ability to select and edit current element',
        flexDirection: 'column',
      },
      { todotask: 'recursive drag and drop elements', flexDirection: 'column' },
      { todotask: 'multi table drag and drop', flexDirection: 'column' },
      { todotask: 'drag actions (copy/move)', flexDirection: 'column' },
      { todotask: 'animated dragged element', flexDirection: 'column' },
      { todotask: 'dragged element positioning', flexDirection: 'column' },
      { todotask: 'drop highlight animation', flexDirection: 'column' },
      { todotask: 'swapping positions animation', flexDirection: 'column' },
      { todotask: 'touch device compatibility', flexDirection: 'column' },
      {
        todotask: 'drop dimention component auto-fit',
        flexDirection: 'column',
      },
      {
        todotask: 'dragged component abstraction and adptability',
        flexDirection: 'column',
      },
      {
        todotask: 'event delegation fixes on drag events',
        flexDirection: 'column',
      },
    ],
  },
];
