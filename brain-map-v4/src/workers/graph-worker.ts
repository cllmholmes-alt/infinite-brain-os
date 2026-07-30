export interface LayoutWorkerRequest {
  type: 'layout';
  jobId: string;
  revision: string;
  inputHash: string;
  seed: number;
  nodeIds: readonly string[];
}

export interface LayoutWorkerResult {
  type: 'layout-result';
  jobId: string;
  revision: string;
  inputHash: string;
  nodeIds: string[];
  positions: Float32Array;
}

const WORKER_SOURCE = String.raw`
self.onmessage = (event) => {
  const request = event.data;
  if (!request || request.type !== 'layout' || !Array.isArray(request.nodeIds)) {
    self.postMessage({ type: 'worker-error', message: 'invalid-request' });
    return;
  }
  const ids = [...request.nodeIds].sort();
  let state = (request.seed >>> 0) || 0x6d2b79f5;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
  const positions = new Float32Array(ids.length * 2);
  for (let index = 0; index < ids.length; index += 1) {
    const angle = (index / Math.max(1, ids.length)) * Math.PI * 2;
    const radius = 0.22 + random() * 0.26;
    positions[index * 2] = 0.5 + Math.cos(angle) * radius;
    positions[index * 2 + 1] = 0.5 + Math.sin(angle) * radius;
  }
  self.postMessage({
    type: 'layout-result',
    jobId: request.jobId,
    revision: request.revision,
    inputHash: request.inputHash,
    nodeIds: ids,
    positions,
  }, [positions.buffer]);
};
`;

export function acceptWorkerResult(
  result: LayoutWorkerResult,
  currentRevision: string,
  currentInputHash?: string,
): boolean {
  return (
    result.type === 'layout-result' &&
    result.revision === currentRevision &&
    (!currentInputHash || result.inputHash === currentInputHash) &&
    new Set(result.nodeIds).size === result.nodeIds.length &&
    result.positions.length === result.nodeIds.length * 2 &&
    [...result.positions].every(Number.isFinite)
  );
}

export function acceptBoundWorkerResult(
  request: LayoutWorkerRequest,
  result: LayoutWorkerResult,
): boolean {
  const requestedIds = [...request.nodeIds].sort();
  const resultIds = [...result.nodeIds].sort();
  return (
    result.jobId === request.jobId &&
    result.revision === request.revision &&
    result.inputHash === request.inputHash &&
    requestedIds.length === resultIds.length &&
    requestedIds.every((id, index) => id === resultIds[index]) &&
    acceptWorkerResult(result, request.revision, request.inputHash)
  );
}

export function runLayoutWorker(
  request: LayoutWorkerRequest,
  timeoutMs = 3000,
): Promise<LayoutWorkerResult> {
  if (typeof Worker === 'undefined') {
    return Promise.reject(new Error('worker-unavailable'));
  }
  const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }));
  const worker = new Worker(url, { name: 'brain-map-v4-layout' });
  return new Promise((resolve, reject) => {
    const cleanup = (): void => {
      worker.terminate();
      URL.revokeObjectURL(url);
    };
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error('worker-timeout'));
    }, timeoutMs);
    worker.onerror = () => {
      window.clearTimeout(timer);
      cleanup();
      reject(new Error('worker-failed'));
    };
    worker.onmessage = (event: MessageEvent<LayoutWorkerResult | { type: 'worker-error' }>) => {
      window.clearTimeout(timer);
      cleanup();
      if (event.data.type !== 'layout-result') {
        reject(new Error('worker-invalid-result'));
        return;
      }
      resolve(event.data);
    };
    worker.postMessage(request);
  });
}

export async function verifyLayoutWorker(): Promise<{
  worker: boolean;
  deterministic: boolean;
  staleRejected: boolean;
  transferredCoordinates: number;
}> {
  const request: LayoutWorkerRequest = {
    type: 'layout',
    jobId: 'cert-layout',
    revision: 'fixture-revision-1',
    inputHash: 'fixture-hash-1',
    seed: 0xb4a1c0de,
    nodeIds: ['node-c', 'node-a', 'node-b'],
  };
  const first = await runLayoutWorker(request);
  const second = await runLayoutWorker({ ...request, jobId: 'cert-layout-repeat' });
  return {
    worker: acceptWorkerResult(first, request.revision),
    deterministic:
      first.nodeIds.join('\u0000') === second.nodeIds.join('\u0000') &&
      [...first.positions].every((value, index) => value === second.positions[index]),
    staleRejected: !acceptWorkerResult({ ...first, revision: 'stale-revision' }, request.revision),
    transferredCoordinates: first.positions.length,
  };
}
