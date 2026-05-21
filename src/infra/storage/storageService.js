// Storage is isolated in the infra layer because it depends on the browser environment.
// SOLID: Dependency Inversion - higher layers depend on this abstraction, not localStorage directly.
export default class StorageService {
  constructor(namespace = "orders") {
    this.namespace = namespace;
  }

  getAll() {
    const stored = localStorage.getItem(this.namespace);
    return stored ? JSON.parse(stored) : [];
  }

  saveAll(items) {
    localStorage.setItem(this.namespace, JSON.stringify(items));
  }
}