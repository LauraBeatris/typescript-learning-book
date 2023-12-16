import { S } from 'ts-toolbelt';
import { z, ZodError } from 'zod';
import express, { Request, RequestHandler } from 'express';
import { ParsedQs } from 'qs';
import { Equal, Expect } from './support/test-utils';

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

/**
 * Extracting object properties with reduce and generics
 */
{
  const pick = <TObj, TPicked extends keyof TObj>(
    obj: TObj,
    picked: Array<TPicked>,
  ) => {
    return picked.reduce(
      (acc, key) => {
        acc[key] = obj[key];
        return acc;
      },
      {} as Pick<TObj, TPicked>,
    );
  };

  const result = pick(
    {
      a: 1,
      b: 2,
      c: 3,
    },
    ['a', 'b'],
  );

  // Should not allow you to pass keys which do not exist in the object
  pick(
    {
      a: 1,
      b: 2,
      c: 3,
    },
    [
      'a',
      'b',
      // @ts-expect-error
      'd',
    ],
  );

  type Tests = Expect<Equal<typeof result, { a: number; b: number }>>;
}

/**
 * Add strong typing and proper error handling to a form validator
 */
{
  const makeFormValidatorFactory =
    <TValidatorKeys extends string>(
      validators: Record<TValidatorKeys, (value: string) => string | void>,
    ) =>
    <TFormKeys extends string>(
      config: Record<TFormKeys, Array<TValidatorKeys>>,
    ) => {
      return (values: Record<TFormKeys, string>) => {
        const errors = {} as Record<TFormKeys, string | undefined>;

        for (const key in config) {
          for (const validator of config[key]) {
            const error = validators[validator](values[key]);
            if (error) {
              errors[key] = error;
              break;
            }
          }
        }

        return errors;
      };
    };

  const createFormValidator = makeFormValidatorFactory({
    required: (value) => {
      if (value === '') {
        return 'Required';
      }
    },
    minLength: (value) => {
      if (value.length < 5) {
        return 'Minimum length is 5';
      }
    },
    email: (value) => {
      if (!value.includes('@')) {
        return 'Invalid email';
      }
    },
  });

  const validateUser = createFormValidator({
    id: ['required'],
    username: ['required', 'minLength'],
    email: ['required', 'email'],
  });

  const errors = validateUser({
    id: '1',
    username: 'john',
    email: 'Blah',
  });

  type Tests = [
    Expect<
      Equal<
        typeof errors,
        {
          id: string | undefined;
          username: string | undefined;
          email: string | undefined;
        }
      >
    >,
  ];
}

/**
 * Improve a fetch function to handle missing type arguments
 */
(async () => {
  const fetchData = async <
    TResult = 'You must pass a type argument to fetchData',
  >(
    url: string,
  ): Promise<TResult> => {
    const data = await fetch(url).then((response) => response.json());
    return data;
  };

  const data1 = await fetchData<{ name: string }>(
    'https://swapi.dev/api/people/1',
  );

  const data2 = await fetchData('https://swapi.dev/api/people/1');

  type Tests = [
    Expect<Equal<typeof data1, { name: string }>>,
    Expect<Equal<typeof data2, 'You must pass a type argument to fetchData'>>,
  ];
})();

/**
 * Using overloads and generics to type function composition
 */
{
  function compose<T1, T2>(func1: (t1: T1) => T2): (t1: T1) => T2;
  function compose<T1, T2, T3>(
    func1: (t1: T1) => T2,
    func2: (t2: T2) => T3,
  ): (t1: T1) => T3;
  function compose<T1, T2, T3, T4>(
    func1: (t1: T1) => T2,
    func2: (t2: T2) => T3,
    func3: (t3: T3) => T4,
  ): (t1: T1) => T4;
  function compose(...funcs: Array<(input: any) => any>) {
    return (input: any) => {
      return funcs.reduce((acc, fn) => fn(acc), input);
    };
  }

  const addOne = (num: number) => {
    return num + 1;
  };

  const addTwoAndStringify = compose(addOne, addOne, String);

  const result = addTwoAndStringify(4);

  type Tests = [Expect<Equal<typeof result, string>>];

  const stringifyThenAddOne = compose(
    // @ts-expect-error
    String,
    addOne,
  );
}

/**
 * Dynamic argument support with conditional types
 */
{
  const translations = {
    title: 'Hello, {name}!',
    subtitle: 'You have {count} unread messages.',
    button: 'Click me!',
  } as const;

  type GetParamKeys<TTranslation extends string> = TTranslation extends ''
    ? []
    : TTranslation extends `${string}{${infer Param}}${infer Tail}`
    ? [Param, ...GetParamKeys<Tail>]
    : [];

  const translate = <
    TTranslations extends Record<string, string>,
    TKey extends keyof TTranslations,
    TParams extends string[] = GetParamKeys<TTranslations[TKey]>,
  >(
    translations: TTranslations,
    key: TKey,
    ...args: TParams extends [] ? [] : [params: Record<TParams[number], string>]
  ) => {
    const translation = translations[key];
    const params: any = args[0] || {};

    return translation.replace(/{(\w+)}/g, (_, key) => params[key]);
  };

  const buttonText = translate(translations, 'button');
  const subtitleText = translate(translations, 'subtitle', {
    count: '2',
  });

  // Should force you to provide parameters if required
  // @ts-expect-error
  translate(translations, 'title');

  // Should not let you pass parameters if NOT required
  // @ts-expect-error
  translate(translations, 'button', {});
}

/**
 * Merge dynamic objects with global objects
 */
const addAllOfThisToWindow = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => a / b,
};

declare global {
  type AddAllOfThisToWindow = typeof addAllOfThisToWindow;
  interface Window extends AddAllOfThisToWindow {}
}
{
  Object.assign(window, addAllOfThisToWindow);

  type Tests = [
    Expect<Equal<typeof window.add, (a: number, b: number) => number>>,
    Expect<Equal<typeof window.subtract, (a: number, b: number) => number>>,
    Expect<Equal<typeof window.multiply, (a: number, b: number) => number>>,
    Expect<Equal<typeof window.divide, (a: number, b: number) => number>>,
  ];
}

/**
 * Narrowing with arrays and generics
 */
{
  interface Fruit {
    name: string;
    price: number;
  }

  const wrapFruit = <const TFruits extends readonly Fruit[]>(
    fruits: TFruits,
  ) => {
    const getFruit = <TName extends TFruits[number]['name']>(name: TName) => {
      return fruits.find((fruit) => fruit.name === name) as Extract<
        TFruits[number],
        { name: TName }
      >;
    };

    return {
      getFruit,
    };
  };

  const fruits = wrapFruit([
    {
      name: 'apple',
      price: 1,
    },
    {
      name: 'banana',
      price: 2,
    },
  ]);

  const banana = fruits.getFruit('banana');
  const apple = fruits.getFruit('apple');
  // @ts-expect-error
  const notAllowed = fruits.getFruit('not-allowed');

  type Tests = [
    Expect<Equal<typeof apple, { readonly name: 'apple'; readonly price: 1 }>>,
    Expect<
      Equal<typeof banana, { readonly name: 'banana'; readonly price: 2 }>
    >,
  ];
}

/**
 * Creating a type-safe request handler with Zod and Express
 */
{
  const makeTypeSafeHandler = <
    TQuery extends ParsedQs = any,
    TBody extends Record<string, any> = any,
  >(
    config: {
      query?: z.Schema<TQuery>;
      body?: z.Schema<TBody>;
    },
    handler: RequestHandler<any, any, TBody, TQuery>,
  ): RequestHandler<any, any, TBody, TQuery> => {
    return (req: Request<any, any, TBody, TQuery>, res, next) => {
      const { query, body } = req;
      if (config.query) {
        try {
          config.query.parse(query);
        } catch (e) {
          return res.status(400).send((e as ZodError).message);
        }
      }
      if (config.body) {
        try {
          config.body.parse(body);
        } catch (e) {
          return res.status(400).send((e as ZodError).message);
        }
      }
      return handler(req, res, next);
    };
  };

  const app = express();

  // Should make the query AND body type safe
  app.get(
    '/users',
    makeTypeSafeHandler(
      {
        query: z.object({
          id: z.string(),
        }),
        body: z.object({
          name: z.string(),
        }),
      },
      (req, res) => {
        type tests = [
          Expect<Equal<typeof req.query, { id: string }>>,
          Expect<Equal<typeof req.body, { name: string }>>,
        ];
      },
    ),
  );

  // Should default them to any if not passed in config
  app.get(
    '/users',
    makeTypeSafeHandler({}, (req, res) => {
      type tests = [
        Expect<Equal<typeof req.query, any>>,
        Expect<Equal<typeof req.body, any>>,
      ];
    }),
  );
}

/**
 * Building a dynamic reducer with builder pattern
 */
{
  type PayloadsToDiscriminatedUnion<T extends Record<string, any>> = {
    [K in keyof T]: { type: K } & T[K];
  }[keyof T];

  class DynamicReducer<TState, TPayloadMap extends Record<string, any> = {}> {
    private handlers = {} as Record<
      string,
      (state: TState, payload: any) => TState
    >;

    addHandler<TType extends string, TPayload extends object>(
      type: TType,
      handler: (state: TState, payload: TPayload) => TState,
    ): DynamicReducer<TState, TPayloadMap & Record<TType, TPayload>> {
      this.handlers[type] = handler;

      return this;
    }

    reduce(
      state: TState,
      action: PayloadsToDiscriminatedUnion<TPayloadMap>,
    ): TState {
      const handler = this.handlers[action.type];
      if (!handler) {
        return state;
      }

      return handler(state, action);
    }
  }

  interface State {
    username: string;
    password: string;
  }

  const reducer = new DynamicReducer<State>()
    .addHandler(
      'LOG_IN',
      (state, action: { username: string; password: string }) => {
        return {
          username: action.username,
          password: action.password,
        };
      },
    )
    .addHandler('LOG_OUT', () => {
      return {
        username: '',
        password: '',
      };
    });

  const state = reducer.reduce(
    { username: '', password: '' },
    { type: 'LOG_IN', username: 'foo', password: 'bar' },
  );

  type Tests = [Expect<Equal<typeof state, State>>];

  reducer.reduce(
    { username: 'foo', password: 'bar' },
    {
      // @ts-expect-error
      type: 'NOT_ALLOWED',
    },
  );

  reducer.reduce(
    { username: 'foo', password: 'bar' },
    // @ts-expect-error
    {
      type: 'LOG_IN',
    },
  );
}
