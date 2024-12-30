import { Components, Schema } from "./versions/open-api_3_x";

export class SchemaResolver {

  constructor(private readonly components: Components) { }

  public get(ref: string): Schema | undefined {
    const [type, name] = ref.split('/').slice(-2);
    if (type === 'schemas') {
      return this.components.schemas[name];
    }
  }

  public resolve(schema: any): any {
    if (!schema)
      return undefined;

    if (schema.hasOwnProperty('$ref')) {
      const ref = schema['$ref'];
      const [type, name] = ref.split('/').slice(-2);
      if (type === 'schemas') {
        return this.resolve(this.components.schemas[name]);
      }
    }

    if (schema.hasOwnProperty('type') && schema.type === 'array') {
      return {
        type: 'array',
        items: this.resolve(schema.items)
      };
    }

    if (schema.hasOwnProperty('allOf')) {
      return {
        allOf: schema.allOf.map((s: any) => this.resolve(s))
      };
    }

    if (schema.hasOwnProperty('oneOf')) {
      return {
        oneOf: schema.oneOf.map((s: any) => this.resolve(s))
      };
    }

    if (schema.hasOwnProperty('anyOf')) {
      return {
        anyOf: schema.anyOf.map((s: any) => this.resolve(s))
      };
    }

    if (schema.hasOwnProperty('properties')) {
      const properties: Record<string, any> = {};
      for (const [key, value] of Object.entries(schema.properties)) {
        properties[key] = this.resolve(value);
      }
      return {
        type: 'object',
        properties
      };
    }

    return schema;
  }
}
