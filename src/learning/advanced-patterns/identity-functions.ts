import { F } from 'ts-toolbelt';
import { Equal, Expect } from '../../support/test-utils';

/**
 * Using `const` type parameters for better inference
 */
{
  const asConst = <const T>(t: T) => t;

  const fruits = asConst([
    {
      name: 'apple',
      price: 1,
    },
    {
      name: 'banana',
      price: 2,
    },
  ]);

  type Tests = [
    Expect<
      Equal<
        typeof fruits,
        readonly [
          {
            readonly name: 'apple';
            readonly price: 1;
          },
          {
            readonly name: 'banana';
            readonly price: 2;
          },
        ]
      >
    >,
  ];
}

/**
 * Adding constraints to an identity function
 */
{
  type Fruit = {
    name: string;
    price: number;
  };

  const narrowFruits = <const TFruits extends ReadonlyArray<Fruit>>(
    t: TFruits,
  ) => t;

  const fruits = narrowFruits([
    {
      name: 'apple',
      price: 1,
    },
    {
      name: 'banana',
      price: 2,
    },
  ]);

  const notAllowed = narrowFruits([
    // @ts-expect-error
    'not allowed',
  ]);

  type Tests = [
    Expect<
      Equal<
        typeof fruits,
        readonly [
          {
            readonly name: 'apple';
            readonly price: 1;
          },
          {
            readonly name: 'banana';
            readonly price: 2;
          },
        ]
      >
    >,
  ];

  function useStatuses1<T>(statuses: T[]): T {
    return statuses[0];
  }

  // Gets inferred as "string"
  const loadingStatus1 = useStatuses1(['loading', 'idle']);

  function useStatuses2<const T>(statuses: T[]): T {
    return statuses[0];
  }

  // Gets inferred as narrowly as possible -> "loading" | "idle"
  const loadingStatus2 = useStatuses2(['loading', 'idle']);
}

/**
 * Specifying where inference should not happen
 */
{
  interface FSMConfig<TState extends string> {
    initial: F.NoInfer<TState>;
    states: Record<
      TState,
      {
        onEntry?: () => void;
      }
    >;
  }

  const makeFiniteStateMachine = <TState extends string>(
    config: FSMConfig<TState>,
  ) => config;

  const config = makeFiniteStateMachine({
    initial: 'a',
    states: {
      a: {
        onEntry: () => {
          console.log('a');
        },
      },
      // b should be allowed to be specified!
      b: {},
    },
  });

  const config2 = makeFiniteStateMachine({
    // c should not be allowed! It doesn't exist on the states below
    // @ts-expect-error
    initial: 'c',
    states: {
      a: {},
      // b should be allowed to be specified!
      b: {},
    },
  });
}

/**
 * Avoiding duplicate code in an identity function with generics
 */
{
  interface Config<TRoute extends string> {
    routes: TRoute[];
    fetchers: Record<TRoute, () => any>;
  }

  const makeConfigObj = <const TRoute extends string>(config: Config<TRoute>) =>
    config;

  const config = makeConfigObj({
    routes: ['/', '/about', '/contact'],
    fetchers: {
      // @ts-expect-error
      '/does-not-exist': () => {
        return {};
      },
    },
  });
}

/**
 * Inference inception in an identity function with mapped types
 */
{
  type EventHandlers<TObj> = {
    [K in keyof TObj]: (arg: K) => void;
  };

  function makeEventHandlers<TObj>(obj: EventHandlers<TObj>) {
    return obj;
  }

  const obj = makeEventHandlers({
    click: (name) => {
      type Tests = [Expect<Equal<typeof name, 'click'>>];
    },
    focus: (name) => {
      type Tests = [Expect<Equal<typeof name, 'focus'>>];
    },
  });
}
