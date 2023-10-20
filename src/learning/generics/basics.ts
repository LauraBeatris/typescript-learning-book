import { Equal, Expect } from '../../test-utils';

/**
 * Typing functions with generics
 */
{
  const returnWhatIPassIn = <T>(t: T): T => {
    return t;
  };

  const one = returnWhatIPassIn(1);
  const matt = returnWhatIPassIn('matt');

  type Tests = [
    Expect<Equal<typeof one, 1>>,
    Expect<Equal<typeof matt, 'matt'>>,
  ];
}

/**
 * Restricting generic argument types
 */
{
  const returnWhatIPassIn = <T extends string>(t: T) => t;

  const a = returnWhatIPassIn('a');

  type Tests = [Expect<Equal<typeof a, 'a'>>];

  // @ts-expect-error
  returnWhatIPassIn(1);

  // @ts-expect-error
  returnWhatIPassIn(true);

  // @ts-expect-error
  returnWhatIPassIn({
    foo: 'bar',
  });
}
