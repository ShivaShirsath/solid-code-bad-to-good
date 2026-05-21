// Simple storage wrapper to abstract localStorage access.
// SOLID: Dependency Inversion - higher-level modules depend on this abstraction
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
