import { Icon, RegisteredIcon } from "./types";

class IconRegistry {
  private icons = new Map<string, RegisteredIcon>();

  register(name: string, icon: RegisteredIcon) {
    if (this.icons.has(name)) {
      throw new Error(`Icon with id ${name} is already registered.`);
    }

    this.icons.set(name, icon);
  }

  get(name: string): RegisteredIcon | undefined {
    return this.icons.get(name);
  }
}

export const iconRegistry = new IconRegistry();
