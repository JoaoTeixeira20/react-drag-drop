export type idType<T> = {
  id: string;
  tableId: string;
  item: T;
};

export type elementType = {
  width: string | number;
  height: string | number;
  content: {
    categoryIndex: number;
    componentIndex: number;
  };
};

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
