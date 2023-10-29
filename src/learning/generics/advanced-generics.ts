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
