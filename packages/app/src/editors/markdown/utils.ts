import type { TreeCursor } from '@lezer/common';

export function iterChildren(
  cursor: TreeCursor,
  enter: (cursor: TreeCursor) => undefined | boolean,
): void {
  if (!cursor.firstChild()) return;
  do {
    if (enter(cursor)) break;
  } while (cursor.nextSibling());
  console.assert(cursor.parent());
}
