export interface GraphTask {
  id: string;
  estimatedMs: number;
  priority: number;
}

export class GraphWorkScheduler {
  private queue: GraphTask[] = [];

  constructor(private frameBudgetMs: number) {
    if (!Number.isFinite(frameBudgetMs) || frameBudgetMs <= 0)
      throw new Error('frame-budget-invalid');
  }

  enqueue(task: GraphTask): void {
    if (
      !task.id.trim() ||
      !Number.isFinite(task.estimatedMs) ||
      task.estimatedMs < 0 ||
      !Number.isFinite(task.priority)
    ) {
      throw new Error('graph-task-invalid');
    }
    if (this.queue.some((entry) => entry.id === task.id)) throw new Error('graph-task-duplicate');
    this.queue.push(structuredClone(task));
  }

  nextFrame(): { scheduled: GraphTask[]; deferred: GraphTask[]; estimatedMs: number } {
    const ordered = [...this.queue].sort(
      (left, right) => left.priority - right.priority || left.id.localeCompare(right.id),
    );
    const scheduled: GraphTask[] = [];
    const deferred: GraphTask[] = [];
    let estimatedMs = 0;
    for (const task of ordered) {
      if (estimatedMs + task.estimatedMs <= this.frameBudgetMs) {
        scheduled.push(task);
        estimatedMs += task.estimatedMs;
      } else {
        deferred.push(task);
      }
    }
    this.queue = structuredClone(deferred);
    return {
      scheduled: structuredClone(scheduled),
      deferred: structuredClone(deferred),
      estimatedMs,
    };
  }
}
