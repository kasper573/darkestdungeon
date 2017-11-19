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
