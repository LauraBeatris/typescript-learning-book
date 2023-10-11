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
