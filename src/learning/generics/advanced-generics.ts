import { Equal, Expect } from '../../test-utils';

/**
 * Generics with conditional types
 */
{
  function youSayGoodbyeISayHello1<
    TGreeting extends 'hello' | 'goodbye',
    TResult = TGreeting extends 'hello'
      ? 'goodbye'
      : TGreeting extends 'goodbye'
      ? 'hello'
      : never,
  >(greeting: TGreeting) {
    return (greeting === 'goodbye' ? 'hello' : 'goodbye') as TResult;
  }

  type TGreetingResult<TGreeting extends 'hello' | 'goodbye'> =
    TGreeting extends 'hello' ? 'goodbye' : 'hello';

  function youSayGoodbyeISayHello2<TGreeting extends 'hello' | 'goodbye'>(
    greeting: TGreeting,
  ) {
    return (
      greeting === 'goodbye' ? 'hello' : 'goodbye'
    ) as TGreetingResult<TGreeting>;
  }

  const result1 = youSayGoodbyeISayHello1('hello');
  const result2 = youSayGoodbyeISayHello1('goodbye');

  const result3 = youSayGoodbyeISayHello2('hello');
  const result4 = youSayGoodbyeISayHello2('goodbye');

  type Tests = [
    Expect<Equal<typeof result1, 'goodbye'>>,
    Expect<Equal<typeof result2, 'hello'>>,
    Expect<Equal<typeof result3, 'goodbye'>>,
    Expect<Equal<typeof result4, 'hello'>>,
  ];
}

/**
 * Fixing errors in generic functions with `as`
 */
{
  type Person = {
    name: string;
    age: number;
    birthdate: Date;
  };

  function remapPerson<Key extends keyof Person>(key: Key, value: Person[Key]) {
    if (key === 'birthdate') {
      return new Date() as Person[Key];
    }

    return value;
  }

  const date = remapPerson('birthdate', new Date());
  const num = remapPerson('age', 42);
  const name = remapPerson('name', 'John Doe');

  type Tests = [
    Expect<Equal<typeof date, Date>>,
    Expect<Equal<typeof num, number>>,
    Expect<Equal<typeof name, string>>,
  ];
}

/**
 * Type inference in curried functions
 */
{
  const curryFunction =
    <T>(t: T) =>
    <U>(u: U) =>
    <V>(v: V) => {
      return {
        t,
        u,
        v,
      };
    };

  const result = curryFunction(1)(2)(3);

  type Tests = [
    Expect<Equal<typeof result, { t: number; u: number; v: number }>>,
  ];
}
