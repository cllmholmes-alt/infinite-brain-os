export interface SavedView {
  id: string;
  label: string;
  owner: string;
  filters: Record<string, unknown>;
  createdAt: string;
  scope: 'live' | 'snapshot';
}

const savedViews: SavedView[] = [];

export function saveView(view: SavedView): void {
  savedViews.push({ ...view, createdAt: new Date().toISOString() });
}

export function listViews(): SavedView[] {
  return [...savedViews];
}

export function findView(id: string): SavedView | undefined {
  return savedViews.find((view) => view.id === id);
}
