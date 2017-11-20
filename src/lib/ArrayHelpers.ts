export function moveItem <T> (item: T, fromList: T[], toList: T[]) {
  removeItem(item, fromList);
  removeItem(item, toList);
  toList.push(item);
}

export function removeItem <T> (item: T, a: T[]) {
  const index = a.indexOf(item);
  if (index !== -1) {
    a.splice(index, 1);
  }
}

export function findSubset <T> (needles: T[], haystack: T[]) {
  const subset: T[] = [];
  for (const needle of needles) {
    if (haystack.indexOf(needle) !== -1) {
      subset.push(needle);
    }
  }
  return subset;
}

export function count (n: number) {
  return range(0, n);
}

export function range (start: number, end: number) {
  const list = [];
  for (let i = start; i < end; i++) {
    list.push(i);
  }
  return list;
}
