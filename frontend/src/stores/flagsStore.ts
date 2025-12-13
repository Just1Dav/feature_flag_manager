import type { Environment } from '@/stores/environmentsStore';
import { atom } from 'nanostores';

export interface FeatureFlag {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  environmentId: number;

  environment?: Environment;
}

export const $flags = atom<FeatureFlag[]>([]);

export function setFlags(flags: FeatureFlag[]) {
  $flags.set(flags);
}

export function addFlagToStore(flag: FeatureFlag) {
  $flags.set([flag, ...$flags.get()]);
}

export function updateFlagInStore(updatedFlag: FeatureFlag) {
  const current = $flags.get();
  $flags.set(current.map((f) => (f.id === updatedFlag.id ? updatedFlag : f)));
}

export function removeFlagFromStore(id: number) {
  $flags.set($flags.get().filter((f) => f.id !== id));
}
