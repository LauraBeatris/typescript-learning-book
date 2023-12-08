import _, { List } from 'lodash';
import { fetchUser } from '../../helpers';
import { Equal, Expect, ExpectExtends } from '../../test-utils';

/**
 * Retrieving function parameters from an external library
 */
{
  type ParametersOfFetchUser = Parameters<typeof fetchUser>;

  type ReturnTypeOfFetchUserWithFullName = Awaited<
    ReturnType<typeof fetchUser>
  > & {
    fullName: string;
  };

  const fetchUserWithFullName = async (
    ...args: ParametersOfFetchUser
  ): Promise<ReturnTypeOfFetchUserWithFullName> => {
    const user = await fetchUser(...args);
    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  };

  type Tests = [
    Expect<Equal<ParametersOfFetchUser, [string]>>,
    Expect<
      ExpectExtends<
        { id: string; firstName: string; lastName: string; fullName: string },
        ReturnTypeOfFetchUserWithFullName
      >
    >,
  ];
}

/**
 * Passing type arguments with Lodash
 */
{
  const groupByAge = <T extends { age: number }>(array: List<T>) => {
    const grouped = _.groupBy<T>(array, 'age');

    return grouped;
  };

  const result = groupByAge([
    {
      name: 'John',
      age: 20,
    },
    {
      name: 'Jane',
      age: 20,
    },
    {
      name: 'Mary',
      age: 30,
    },
  ]);

  groupByAge([
    {
      // @ts-expect-error
      name: 'John',
    },
    {
      // @ts-expect-error
      name: 'Bill',
    },
  ]);

  type Tests = [
    Expect<Equal<typeof result, _.Dictionary<{ name: string; age: number }[]>>>,
  ];
}
