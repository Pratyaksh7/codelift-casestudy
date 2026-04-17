import type { Order, SortBy, SortDir } from './types';

export function sortOrders(list: Order[], sortBy: SortBy, sortDir: SortDir): Order[] {
  return list.slice().sort((a, b) => {
    let valA: number | string;
    let valB: number | string;
    if (sortBy === 'date') {
      valA = new Date(a.date).getTime();
      valB = new Date(b.date).getTime();
    } else if (sortBy === 'total') {
      valA = a.total;
      valB = b.total;
    } else {
      valA = a.id;
      valB = b.id;
    }
    if (sortDir === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });
}
