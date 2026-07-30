import type { RuntimeState } from '../schema/types';

export type CognitiveProfile = 'standard' | 'calm' | 'recovery';

export class CognitiveLoadController {
  private profile: CognitiveProfile = 'standard';
  private recoveryCheckpoint: string | null = null;
  private runtime: RuntimeState;

  constructor(runtime: RuntimeState) {
    this.runtime = structuredClone(runtime);
  }

  setProfile(profile: CognitiveProfile): void {
    this.profile = profile;
  }

  checkpoint(id: string): void {
    if (!id.trim()) throw new Error('recovery-checkpoint-invalid');
    this.recoveryCheckpoint = id;
  }

  view(actions: string[]): {
    profile: CognitiveProfile;
    dominantAction: string | null;
    hiddenActions: string[];
    recoveryCheckpoint: string | null;
    tunnelDepth: number;
  } {
    const valid = actions.filter((action) => action.trim());
    return {
      profile: this.profile,
      dominantAction: valid[0] ?? null,
      hiddenActions: this.profile === 'standard' ? [] : valid.slice(1),
      recoveryCheckpoint: this.recoveryCheckpoint,
      tunnelDepth: this.profile === 'recovery' ? 1 : this.runtime.focusTunnelDepth,
    };
  }
}
