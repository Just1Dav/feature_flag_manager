import { atom } from 'nanostores';

export interface Project {
  id: number;
  name: string;
  description?: string;
}

// O estado que contém a lista de projetos
export const $projects = atom<Project[]>([]);

// Adiciona projetos iniciais
export function setProjects(projects: Project[]) {
  $projects.set(projects);
}

// Adiciona projeto na lista
export function addProjectToStore(project: Project) {
  $projects.set([project, ...$projects.get()]);
}

export function updateProjectInStore(updatedProject: Project) {
  const currentProjects = $projects.get();
  const newProjects = currentProjects.map((p) => (p.id === updatedProject.id ? updatedProject : p));
  $projects.set(newProjects);
}

export function removeProjectFromStore(id: number) {
  $projects.set($projects.get().filter((p) => p.id !== id));
}
