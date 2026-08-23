export function formatDate(ts) {
  if (!ts) return '';
  const d = ts && typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function firstParagraph(text) {
  if (!text) return '';
  const first = text.split(/\n{2,}/)[0];
  return first.length > 180 ? `${first.slice(0, 180)}…` : first;
}

// Entries with an explicit numeric `order` come first (ascending); entries
// without one fall back to newest-first by `createdAt` (oldest if unset).
export function sortByOrder(items) {
  const withOrder = items.filter((i) => typeof i.order === 'number');
  const without = items.filter((i) => typeof i.order !== 'number');
  withOrder.sort((a, b) => a.order - b.order);
  without.sort((a, b) => {
    const ta = a.createdAt ? a.createdAt.toDate?.() ?? new Date(a.createdAt) : new Date(0);
    const tb = b.createdAt ? b.createdAt.toDate?.() ?? new Date(b.createdAt) : new Date(0);
    return tb - ta;
  });
  return [...withOrder, ...without];
}
