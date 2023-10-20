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

  type tests = [
    Expect<Equal<typeof one, 1>>,
    Expect<Equal<typeof matt, 'matt'>>,
  ];
}
