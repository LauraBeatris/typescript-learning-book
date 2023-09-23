import { Equal, Expect } from '../../test-utils';

/**
 * Adding conditional logic to a type helper
 */
{
  type YouSayGoodbyeAndISayHello<T> = T extends 'goodbye' ? 'hello' : 'goodbye';

  type Tests = [
    Expect<Equal<YouSayGoodbyeAndISayHello<'goodbye'>, 'hello'>>,
    Expect<Equal<YouSayGoodbyeAndISayHello<'hello'>, 'goodbye'>>,
  ];
}

/**
 * Refining conditional logic in type helper with `never`
 */
{
  type YouSayGoodbyeAndISayHello<T> = T extends 'goodbye' | 'hello'
    ? T extends 'goodbye'
      ? 'hello'
      : 'goodbye'
    : never;

  type Tests = [
    Expect<Equal<YouSayGoodbyeAndISayHello<'hello'>, 'goodbye'>>,
    Expect<Equal<YouSayGoodbyeAndISayHello<'goodbye'>, 'hello'>>,
    Expect<Equal<YouSayGoodbyeAndISayHello<'alright pal'>, never>>,
    Expect<Equal<YouSayGoodbyeAndISayHello<1>, never>>,
  ];
}

/**
 * Introducing `infer` for conditional logic
 */
{
  type GetDataValue<T> = T extends { data: infer TData } ? TData : never;

  type Tests = [
    Expect<Equal<GetDataValue<{ data: 'hello' }>, 'hello'>>,
    Expect<Equal<GetDataValue<{ data: { name: 'hello' } }>, { name: 'hello' }>>,
    Expect<
      Equal<
        GetDataValue<{ data: { name: 'hello'; age: 20 } }>,
        { name: 'hello'; age: 20 }
      >
    >,
    // Expect that if you pass in string, it
    // should return never
    Expect<Equal<GetDataValue<string>, never>>,
  ];
}

/**
 * Extracting type arguments to another Type Helper
 */
{
  interface MyComplexInterface<Event, Context, Name, Point> {
    getEvent: () => Event;
    getContext: () => Context;
    getName: () => Name;
    getPoint: () => Point;
  }

  type Example = MyComplexInterface<
    'click',
    'window',
    'my-event',
    { x: 12; y: 14 }
  >;

  type GetPoint<T> = T extends MyComplexInterface<any, any, any, infer TPoint>
    ? TPoint
    : never;

  type Tests = [Expect<Equal<GetPoint<Example>, { x: 12; y: 14 }>>];
}

/**
 * Extracting parts of a string with a template literal
 */
{
  type Names = [
    'Matt Pocock',
    'Jimi Hendrix',
    'Eric Clapton',
    'John Mayer',
    'BB King',
  ];

  type GetSurname<T> = T extends `${string} ${infer TSurname}`
    ? TSurname
    : never;

  type Tests = [
    Expect<Equal<GetSurname<Names[0]>, 'Pocock'>>,
    Expect<Equal<GetSurname<Names[1]>, 'Hendrix'>>,
    Expect<Equal<GetSurname<Names[2]>, 'Clapton'>>,
    Expect<Equal<GetSurname<Names[3]>, 'Mayer'>>,
    Expect<Equal<GetSurname<Names[4]>, 'King'>>,
  ];
}
/**
 * Extract the result of an async function
 */
{
  const getServerSideProps = async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const json: { title: string } = await data.json();
    return {
      props: {
        json,
      },
    };
  };

  // Constraining the type argument to a function
  type InferPropsFromServerSideFunction1<T extends (...args: any[]) => any> =
    Awaited<ReturnType<T>> extends { props: infer TProps } ? TProps : never;

  // Simpler version, not contraining argument
  type InferPropsFromServerSideFunction2<T> = T extends () => Promise<{
    props: infer TProps;
  }>
    ? TProps
    : never;

  type tests = [
    Expect<
      Equal<
        InferPropsFromServerSideFunction1<typeof getServerSideProps>,
        { json: { title: string } }
      >
    >,
    Expect<
      Equal<
        InferPropsFromServerSideFunction2<typeof getServerSideProps>,
        { json: { title: string } }
      >
    >,
  ];
}

/**
 * Extracting the result from several possible function shapes
 */
{
  const parser1 = {
    parse: () => 1,
  };

  const parser2 = () => '123';

  const parser3 = {
    extract: () => true,
  };

  // Targetting different cases with long ternaries, therefore difficult to read
  type GetParserResult1<T> = T extends { parse: () => infer TParse }
    ? TParse
    : T extends () => infer TResult
    ? TResult
    : T extends { extract: () => infer TResult }
    ? TResult
    : never;

  // Using union to target different cases, better to read
  type GetParserResult2<T> = T extends
    | (() => infer TResult)
    | { parse: () => infer TResult }
    | { extract: () => infer TResult }
    ? TResult
    : never;

  type Tests = [
    Expect<Equal<GetParserResult1<typeof parser1>, number>>,
    Expect<Equal<GetParserResult1<typeof parser2>, string>>,
    Expect<Equal<GetParserResult1<typeof parser3>, boolean>>,
    Expect<Equal<GetParserResult2<typeof parser1>, number>>,
    Expect<Equal<GetParserResult2<typeof parser2>, string>>,
    Expect<Equal<GetParserResult2<typeof parser3>, boolean>>,
  ];
}

/**
 * Distributivity in conditional types
 */
{
  type Fruit = 'apple' | 'banana' | 'orange';

  type AppleOrBanana = Fruit extends infer T
    ? T extends 'banana' | 'apple'
      ? T
      : never
    : never;

  type Tests = [Expect<Equal<AppleOrBanana, 'apple' | 'banana'>>];
}
