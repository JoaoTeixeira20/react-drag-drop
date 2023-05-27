export type idType<T> = {
  id: string;
  tableId: string;
  item: T;
};

export type contextConfigType = {
  droppableSlotSize: {
    width: number,
    height: number,
  }
}

export type actionType =
  | 'none'
  | 'copy'
  | 'copyLink'
  | 'copyMove'
  | 'link'
  | 'linkMove'
  | 'move'
  | 'all'
  | 'uninitialized';
