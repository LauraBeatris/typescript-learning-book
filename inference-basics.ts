/**
 * Get the return type of a function - ReturnType<>
 */
{
  const getGreetings = (name: string) => `Hi ${name}`;

  type GetGreetings = typeof getGreetings;
  type ReturnValue = ReturnType<GetGreetings>;
}

/**
 * Extract function parameters into a type - Parameters<>
 */
{
  const getGreetings = (name: string) => `Hi ${name}`;
  type GetGreetingsParameters = Parameters<typeof getGreetings>;
}

/**
 * Extract the awaited result of a promise - Awaited<>
 */
{
  const getDog = () =>
    Promise.resolve({
      name: "Charlie",
      breed: "Golden",
    });

  type GetDogReturnType = ReturnType<typeof getDog>;
  type GetDogReturnTypeAwaited = Awaited<GetDogReturnType>;
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
}
