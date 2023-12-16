import { Equal, Expect } from '../../support/test-utils';

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

/**
 * Mapping a discriminated union to an object
 *
 * 1. Map over the `Route['route']` union. Each key is set to the value of `route`
 * which is then assigned to R. `Extract` is used to extract only the union member
 * that matches the current `route` `R` value.
 *
 * 2. Itinerate over `Route` itself and remap the keys using `as` clause.
 * In that way, it's possible to have access to the entire `Route` object
 * instead of only the `route` property, being able to use indexed access to
 * get the `search` property directly without the use of `Extract`.
 */
{
  type Route =
    | {
        route: '/';
        search: {
          page: string;
          perPage: string;
        };
      }
    | { route: '/about'; search: {} }
    | { route: '/admin'; search: {} }
    | { route: '/admin/users'; search: {} };

  type RoutesObject1 = {
    [R in Route['route']]: Extract<Route, { route: R }>['search'];
  };

  type RoutesObject2 = {
    [R in Route as R['route']]: R['search'];
  };

  type Tests = [
    Expect<
      Equal<
        RoutesObject1,
        {
          '/': {
            page: string;
            perPage: string;
          };
          '/about': {};
          '/admin': {};
          '/admin/users': {};
        }
      >
    >,
    Expect<
      Equal<
        RoutesObject2,
        {
          '/': {
            page: string;
            perPage: string;
          };
          '/about': {};
          '/admin': {};
          '/admin/users': {};
        }
      >
    >,
  ];
}

/**
 * Mapping an object to a union of tuples
 */
{
  interface Values {
    email: string;
    firstName: string;
    lastName: string;
  }

  type ValuesAsUnionOfTuples = {
    [K in keyof Values]: [K, Values[K]];
  }[keyof Values];

  type Tests = [
    Expect<
      Equal<
        ValuesAsUnionOfTuples,
        ['email', string] | ['firstName', string] | ['lastName', string]
      >
    >,
  ];
}

/**
 * Transforming an object into a union of template literals
 */
{
  interface FruitMap {
    apple: 'red';
    banana: 'yellow';
    orange: 'orange';
  }

  type TransformedFruit = {
    [K in keyof FruitMap]: `${K}:${FruitMap[K]}`;
  }[keyof FruitMap];

  type Tests = [
    Expect<
      Equal<TransformedFruit, 'apple:red' | 'banana:yellow' | 'orange:orange'>
    >,
  ];
}

/**
 * Tranforming a discriminated union into a union
 */
{
  type Fruit =
    | {
        name: 'apple';
        color: 'red';
      }
    | {
        name: 'banana';
        color: 'yellow';
      }
    | {
        name: 'orange';
        color: 'orange';
      };

  type TransformedFruit = {
    [K in Fruit as K['name']]: `${K['name']}:${K['color']}`;
  }[Fruit['name']];

  type Tests = [
    Expect<
      Equal<TransformedFruit, 'apple:red' | 'banana:yellow' | 'orange:orange'>
    >,
  ];
}
