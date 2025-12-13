import { atom } from 'nanostores';

export interface Environment {
  id: number;
  name: string;
  description: string;
  projectId: number;
}

export const $environments = atom<Environment[]>([]);

export function setEnvironments(envs: Environment[]) {
  $environments.set(envs);
}

export function addEnvironmentToStore(env: Environment) {
  $environments.set([env, ...$environments.get()]);
}

export function updateEnvironmentInStore(updatedEnv: Environment) {
  const current = $environments.get();
  $environments.set(current.map((e) => (e.id === updatedEnv.id ? updatedEnv : e)));
}

export function removeEnvironmentFromStore(id: number) {
  $environments.set($environments.get().filter((e) => e.id !== id));
}
