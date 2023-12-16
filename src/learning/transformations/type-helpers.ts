import { Equal, Expect } from '../../support/test-utils';

/**
 * The simplest example of a type helper
 */
{
  type ReturnWhatIPassIn<T> = T;

  type Tests = [
    Expect<Equal<ReturnWhatIPassIn<1>, 1>>,
    Expect<Equal<ReturnWhatIPassIn<'1'>, '1'>>,
    Expect<Equal<ReturnWhatIPassIn<true>, true>>,
    Expect<Equal<ReturnWhatIPassIn<false>, false>>,
    Expect<Equal<ReturnWhatIPassIn<null>, null>>,
  ];
}

/**
 * Creating a "Maybe" type helper
 */
{
  type Maybe<T> = T | null | undefined;

  type Tests = [
    Expect<Equal<Maybe<string>, string | null | undefined>>,
    Expect<Equal<Maybe<number>, number | null | undefined>>,
    Expect<Equal<Maybe<boolean>, boolean | null | undefined>>,
    Expect<Equal<Maybe<null>, null | undefined>>,
  ];
}

/**
 * Ensuring type safety in a type helper
 *
 * `extends` can be used to define/strict a certain type for a generic parameter
 */
{
  type FullName<
    TFirst extends string,
    TLast extends string,
  > = `${TFirst} ${TLast}`;

  type Tests = [
    // @ts-expect-error
    FullName<number, number>,
    Expect<Equal<FullName<'Laura', 'Beatris'>, 'Laura Beatris'>>,
  ];
}

/**
 * Create a reusable type helper
 */
{
  type CreateDataShape<TData, TError> = {
    data: TData;
    error: TError;
  };

  type Tests = [
    Expect<
      Equal<
        CreateDataShape<string, TypeError>,
        {
          data: string;
          error: TypeError;
        }
      >
    >,
  ];
}

/**
 * Optional type parameters in type helpers
 *
 * `extends` can also be combined with a default generic parameter type
 */
{
  type CreateDataShape<TData, TError extends Error | undefined = undefined> = {
    data: TData;
    error: TError;
  };

  type Tests = [
    Expect<
      Equal<
        CreateDataShape<string>,
        {
          data: string;
          error: undefined;
        }
      >
    >,
  ];
}

/**
 * Functions as constraints for type helpers
 */
{
  type GetParametersAndReturnType<T extends (...args: any) => any> = {
    params: Parameters<T>;
    returnValue: ReturnType<T>;
  };

  type Tests = [
    Expect<
      Equal<
        GetParametersAndReturnType<() => string>,
        { params: []; returnValue: string }
      >
    >,
    Expect<
      Equal<
        GetParametersAndReturnType<(s: string) => void>,
        { params: [string]; returnValue: void }
      >
    >,
    Expect<
      Equal<
        GetParametersAndReturnType<(n: number, b: boolean) => number>,
        { params: [number, boolean]; returnValue: number }
      >
    >,
  ];
}

/**
 * Constraining types for anything but `null` or `undefined`
 *
 * {} can be used to define anything that it's not `null` or `undefined`
 *
 * TypeScript performs structure comparisons when it checks assignments - also
 * everything is JavaScript is an object
 */
{
  type Maybe<T extends {}> = T | null | undefined;

  type Tests = [
    // @ts-expect-error
    Maybe<null>,
    // @ts-expect-error
    Maybe<undefined>,
    Maybe<string>,
    Maybe<false>,
    Maybe<0>,
    Maybe<''>,
  ];
}

/**
 * Constraining type helpers for Non-Empty arrays
 */
{
  type NonEmptyArray<T> = [T, ...Array<T>];

  const makeEnum = (values: NonEmptyArray<string>) => {};

  makeEnum(['a']);
  makeEnum(['a', 'b', 'c']);

  // @ts-expect-error
  makeEnum([]);
}
