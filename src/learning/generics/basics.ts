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

/**
 * Typing independent parameters
 */
{
  const returnBothOfWhatIPassIn = <A, B>(a: A, b: B) => {
    return {
      a,
      b,
    };
  };

  const result = returnBothOfWhatIPassIn('a', 1);

  type Tests = [
    Expect<
      Equal<
        typeof result,
        {
          a: string;
          b: number;
        }
      >
    >,
  ];
}

/**
 * Typing object parameters
 */
{
  const returnBothOfWhatIPassIn = <T1, T2>(params: { a: T1; b: T2 }) => {
    return {
      first: params.a,
      second: params.b,
    };
  };

  const result = returnBothOfWhatIPassIn({
    a: 'a',
    b: 1,
  });

  type Tests = [
    Expect<
      Equal<
        typeof result,
        {
          first: string;
          second: number;
        }
      >
    >,
  ];
}

/**
 * Generics in classes
 */
{
  class Component<TProps> {
    private props: TProps;

    constructor(props: TProps) {
      this.props = props;
    }

    getProps = () => this.props;
  }

  const component = new Component({ a: 1, b: 2, c: 3 });

  const result = component.getProps();

  type Tests = [
    Expect<Equal<typeof result, { a: number; b: number; c: number }>>,
  ];
}

/**
 * Constructing a mapper function with a generic
 */
{
  const concatenateFirstNameAndLastName = <
    TUser extends { firstName: string; lastName: string },
  >(
    user: TUser,
  ) => {
    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  };

  const users = [
    {
      firstName: 'Matt',
      lastName: 'Pocock',
    },
  ];

  const newUsers = users.map(concatenateFirstNameAndLastName);

  type Tests = [
    Expect<
      Equal<
        typeof newUsers,
        Array<{ firstName: string; lastName: string } & { fullName: string }>
      >
    >,
  ];
}
