import { Equal, Expect } from '../../test-utils';

/**
 * Mapping over an union type to create an object type
 */
{
  type Route = '/' | '/about' | '/admin' | '/admin/users';

  type RoutesObject = {
    [R in Route]: R;
  };

  type Tests = [
    Expect<
      Equal<
        RoutesObject,
        {
          '/': '/';
          '/about': '/about';
          '/admin': '/admin';
          '/admin/users': '/admin/users';
        }
      >
    >,
  ];
}

/**
 * Mapping over an object type
 */
{
  interface Attributes {
    firstName: string;
    lastName: string;
    age: number;
  }

  type AttributeGetters = {
    [K in keyof Attributes]: () => Attributes[K];
  };

  type Tests = [
    Expect<
      Equal<
        AttributeGetters,
        {
          firstName: () => string;
          lastName: () => string;
          age: () => number;
        }
      >
    >,
  ];
}

/**
 * Transforming object keys in mapped types
 */
{
  interface Attributes {
    firstName: string;
    lastName: string;
    age: number;
  }

  type AttributeGetters = {
    [K in keyof Attributes as `get${Capitalize<K>}`]: () => Attributes[K];
  };

  type Tests = [
    Expect<
      Equal<
        AttributeGetters,
        {
          getFirstName: () => string;
          getLastName: () => string;
          getAge: () => number;
        }
      >
    >,
  ];
}

/**
 * Conditionally extracting properties from an object
 */
{
  interface Example {
    name: string;
    age: number;
    id: string;
    organisationId: string;
    groupId: string;
  }

  type SearchForId = `${string}${'id' | 'Id'}${string}`;

  type OnlyIdKeys<T> = {
    [K in keyof T as K extends SearchForId ? K : never]: T[K];
  };

  type Test = OnlyIdKeys<Example>;

  type Tests = [
    Expect<
      Equal<
        OnlyIdKeys<Example>,
        {
          id: string;
          organisationId: string;
          groupId: string;
        }
      >
    >,
    Expect<Equal<OnlyIdKeys<{}>, {}>>,
  ];
}
