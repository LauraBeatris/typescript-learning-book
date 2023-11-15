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

/**
 * Make an infinite scroll function generic with correct type inference
 */
(async () => {
  interface MakeInfiniteScrollParams<TRow> {
    key: keyof TRow;
    // Inferring from a Promise
    fetchRows: () => Promise<TRow[]> | TRow[];
    initialRows?: TRow[];
  }

  const makeInfiniteScroll = <TRow>(params: MakeInfiniteScrollParams<TRow>) => {
    const data = params.initialRows || [];

    const scroll = async () => {
      const rows = await params.fetchRows();
      data.push(...rows);
    };

    return {
      scroll,
      getRows: () => data,
    };
  };

  // Should ensure that the key is one of the properties of the row
  makeInfiniteScroll({
    // @ts-expect-error
    key: 'name',
    fetchRows: () =>
      Promise.resolve([
        {
          id: '1',
        },
      ]),
  });

  const table = makeInfiniteScroll({
    key: 'id',
    fetchRows: () => Promise.resolve([{ id: 1, name: 'John' }]),
  });

  const data = await table.scroll();

  const { getRows } = makeInfiniteScroll({
    key: 'id',
    initialRows: [
      {
        id: 1,
        name: 'John',
      },
    ],
    fetchRows: () => Promise.resolve([]),
  });

  const rows = getRows();

  type Tests = [
    Expect<Equal<typeof rows, Array<{ id: number; name: string }>>>,
  ];
})();

/**
 * Create a function with a dynamic number of arguments
 */
{
  interface Events {
    click: {
      x: number;
      y: number;
    };
    focus: undefined;
  }

  const sendEvent = <TEventKey extends keyof Events>(
    event: TEventKey,
    ...args: Events[TEventKey] extends {} ? [payload: Events[TEventKey]] : []
  ) => {
    // Send the event somewhere!
  };

  // Should force you to pass a second argument when you choose an event with a payload

  // @ts-expect-error
  sendEvent('click');

  sendEvent('click', {
    // @ts-expect-error
    x: 'oh dear',
  });

  sendEvent(
    'click',
    // @ts-expect-error
    {
      y: 1,
    },
  );

  sendEvent('click', {
    x: 1,
    y: 2,
  });

  // Should prevent you from passing a second argument when you choose an event without a payload

  sendEvent(
    'focus',
    // @ts-expect-error
    {},
  );
}
