import { Equal, Expect } from '../../test-utils';

/**
 * Using a type predicate to filter types
 */
{
  const predicate = (value?: string): value is string => Boolean(value);

  const values = ['a', 'b', undefined, 'c', undefined];

  const filteredValues = values.filter(predicate);

  type Tests = [Expect<Equal<typeof filteredValues, string[]>>];
}
