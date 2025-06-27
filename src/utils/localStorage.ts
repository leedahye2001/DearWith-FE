class LocalStorage {
  constructor() {
    if (typeof window === "undefined") {
      throw new Error("LocalStorage cannot be used in server-side rendering.");
    }
  }

  static setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  static getItem(key: string) {
    return localStorage.getItem(key);
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}

export default LocalStorage;
