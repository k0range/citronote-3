// MEMO: default: は関数にして、他と合わせたマイグレを実行できるように
import * as fs from "fs/promises";

interface SchemaType {
  [key: string]: {
    default?: Function | any;
  };
}

export class Store<T> {
  private data: T;

  constructor(private options: { path: string; schema: SchemaType }) {
    this.data = {} as T;
    this.load();
  }

  private async load() {
    try {
      const content = await fs.readFile(this.options.path, "utf-8");
      this.data = JSON.parse(content);
    } catch (error) {
      this.data = this.initializeDefaults();
      this.save();
    }
  }

  private initializeDefaults(schema: SchemaType = this.options.schema): any {
    const result: any = {};
    for (const key in schema) {
      const field = schema[key];
      if ("default" in field) {
        result[key] =
          typeof field.default === "function" ? field.default() : field.default;
      } else if (typeof field === "object") {
        result[key] = this.initializeDefaults(field as SchemaType);
      }
    }
    return result;
  }

  public get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  public set<K extends keyof T>(key: K, value: T[K]): void {
    this.data[key] = value;
    this.save();
  }

  private save() {
    fs.writeFile(
      this.options.path,
      JSON.stringify(this.data, null, 2),
      "utf-8",
    );
  }
}
