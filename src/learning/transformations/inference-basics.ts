import { Equal, Expect } from '../../support/test-utils';

/**
 * Getting the return type of a function - ReturnType<>
 */
{
  const getGreetings = (name: string) => `Hi ${name}`;

  type GetGreetings = typeof getGreetings;
  type ReturnValue = ReturnType<GetGreetings>;

  type Tests = Expect<Equal<ReturnValue, string>>;
}

/**
 * Extracting function parameters into a type - Parameters<>
 */
{
  const getGreetings = (name: string) => `Hi ${name}`;
  type GetGreetingsParameters = Parameters<typeof getGreetings>;

  type Tests = Expect<Equal<GetGreetingsParameters, [name: string]>>;
}

/**
 * Extracting the awaited result of a promise - Awaited<>
 */
{
  const getDog = () =>
    Promise.resolve({
      name: 'Charlie',
      breed: 'Golden',
    });

  type GetDogReturnType = ReturnType<typeof getDog>;
  type GetDogReturnTypeAwaited = Awaited<GetDogReturnType>;

  type Tests = Expect<
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
 * Creating unions from objects using two operators
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

  type Tests = Expect<Equal<MoviesKeys, 'topGun' | 'harryPotter'>>;
}
