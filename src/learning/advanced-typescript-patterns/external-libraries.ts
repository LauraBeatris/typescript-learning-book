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
