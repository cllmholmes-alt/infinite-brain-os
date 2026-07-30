import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

async function run() {
  await mkdir(resolve('brain-map-v4', 'outputs', 'brain-map-v4'), { recursive: true }).catch(
    () => {},
  );
  const out = {
    collectedAt: new Date().toISOString(),
    source: 'read-only-local',
    counts: {
      repos: 1,
      services: 2,
    },
  };
  await writeFile(
    resolve('brain-map-v4', 'outputs', 'brain-map-v4', 'collect-ecosystem.json'),
    JSON.stringify(out, null, 2),
  );
}

run();
