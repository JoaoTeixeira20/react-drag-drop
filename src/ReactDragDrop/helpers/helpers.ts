import { idType } from '../types/draggableLib.type';
import { v4 as uuidv4 } from 'uuid';

export const addIdToElement = <T>(item: T, tableId: string): idType<T> => {
  return { id: uuidv4(), tableId, item };
};

export const debounce = <T extends (...args: any[]) => void>(
  f: T,
  delay: number
) => {
  let timer: NodeJS.Timeout | null = null;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timer!);
    timer = setTimeout(() => f.apply(this, args), delay);
  };
};

export const asyncGetBoundingClientRect = (
  element: Element
): Promise<DOMRect> => {
  return new Promise((res) => {
    res(element.getBoundingClientRect());
  });
};
