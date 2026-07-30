import { GraphDocument } from '../schema/types';
import { digestCanonical } from '../security/integrity';
import { exportManifest } from './redaction';

export function shareableSnapshot(
  document: GraphDocument,
  scope: 'public' | 'internal' | 'confidential',
) {
  const manifest = exportManifest(document, scope);
  return {
    urlSafeText: JSON.stringify(manifest),
    checksum: hashManifest(manifest.document),
  };
}

function hashManifest(doc: GraphDocument): string {
  return `s-sha256-${digestCanonical(doc)}`;
}
