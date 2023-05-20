import { idType } from '../types/draggableLib.type';
import { v4 as uuidv4 } from 'uuid';

export const addIdToElement = <T>(item: T, tableId: string): idType<T> => {
  return { id: uuidv4(), tableId, item };
};
