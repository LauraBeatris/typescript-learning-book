import { Equal, Expect } from './test-utils';
import { S } from 'ts-toolbelt';

/**
 * Transforming path parameters from strings to objects
 */
{
  type UserPath = '/users/:id';

  type UserOrganisationPath = '/users/:id/organisations/:organisationId';

  type ExtractPathParams<TPath extends string> = {
    [K in S.Split<TPath, '/'>[number] as K extends `:${infer P}`
      ? P
      : never]: string;
  };

  type Tests = [
    Expect<Equal<ExtractPathParams<UserPath>, { id: string }>>,
    Expect<
      Equal<
        ExtractPathParams<UserOrganisationPath>,
        { id: string; organisationId: string }
      >
    >,
  ];
}

/**
 * Transforming an object into a discriminated Union
 */
{
  interface Attributes {
    id: string;
    email: string;
    username: string;
  }

  type MutuallyExclusive<T> = {
    [K in keyof T]: Record<K, T[K]>;
  }[keyof T];

  type ExclusiveAttributes = MutuallyExclusive<Attributes>;

  type Tests = [
    Expect<
      Equal<
        ExclusiveAttributes,
        | {
            id: string;
          }
        | {
            email: string;
          }
        | {
            username: string;
          }
      >
    >,
  ];
}

/**
 * Transforming a discriminated union with unique values to an object
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
    | { route: '/about' }
    | { route: '/admin' }
    | { route: '/admin/users' };

  type RoutesObject1 = {
    [K in Route['route']]: Extract<Route, { route: K }> extends {
      search: infer TSearch;
    }
      ? TSearch
      : never;
  };

  type RoutesObject2 = {
    [K in Route as K['route']]: K extends { search: infer TSearch }
      ? TSearch
      : never;
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
          '/about': never;
          '/admin': never;
          '/admin/users': never;
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
          '/about': never;
          '/admin': never;
          '/admin/users': never;
        }
      >
    >,
  ];
}

/**
 * Constructing a deep partial of an object
 */
{
  type DeepPartial<T> = T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : {
        [K in keyof T]?: DeepPartial<T[K]>;
      };

  type MyType = {
    a: string;
    b: number;
    c: {
      d: string;
      e: {
        f: string;
        g: {
          h: string;
          i: string;
        }[];
      };
    };
  };

  type Result = DeepPartial<MyType>;

  type Tests = [
    Expect<
      Equal<
        Result,
        {
          a?: string;
          b?: number;
          c?: {
            d?: string;
            e?: {
              f?: string;
              g?: {
                h?: string;
                i?: string;
              }[];
            };
          };
        }
      >
    >,
  ];
}
