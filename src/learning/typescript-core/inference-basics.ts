import { Equal, Expect } from '../../test-utils';

/**
 * Get the return type of a function - ReturnType<>
 */
{
  const getGreetings = (name: string) => `Hi ${name}`;

  type GetGreetings = typeof getGreetings;
  type ReturnValue = ReturnType<GetGreetings>;

  type Test = Expect<Equal<ReturnValue, string>>;
}

/**
 * Extract function parameters into a type - Parameters<>
 */
{
  const getGreetings = (name: string) => `Hi ${name}`;
  type GetGreetingsParameters = Parameters<typeof getGreetings>;

  type Test = Expect<Equal<GetGreetingsParameters, [name: string]>>;
}

/**
 * Extract the awaited result of a promise - Awaited<>
 */
{
  const getDog = () =>
    Promise.resolve({
      name: 'Charlie',
      breed: 'Golden',
    });

  type GetDogReturnType = ReturnType<typeof getDog>;
  type GetDogReturnTypeAwaited = Awaited<GetDogReturnType>;

  type Test = Expect<
    Equal<
      GetDogReturnTypeAwaited,
      {
        name: string;
        breed: string;
      }
    >
  >;
}

/**
 * Create unions from objects using two operators
 */
{
  const movies = {
    topGun: {
      rate: 9,
    },
    harryPotter: {
      rate: 10,
    },
  };

  type Movies = typeof movies;
  type MoviesKeys = keyof Movies;

  type Test = Expect<Equal<MoviesKeys, 'topGun' | 'harryPotter'>>;
}
