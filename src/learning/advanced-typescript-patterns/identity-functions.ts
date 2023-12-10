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
}
