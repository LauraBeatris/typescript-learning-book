/**
 * "X is not assignable to Y"
 */
{
  interface UserProfile {
    id: string;

    preferences: {
      theme: 'light' | 'dark';
    };
  }

  // Type '"blue"' is not assignable to type '"light" | "dark"'
  let userWithError: UserProfile = {
    id: '123',
    preferences: {
      theme: 'blue',
    },
  };

  /**
   * 3 possible solutions:
   * - Define theme with an proper `theme` union value defined in the interface
   * - Modify the interface `theme` union type to include `blue` as a new member
   * - Make `theme` have a wider type such as `string`
   */
  let userWithSolution: UserProfile = {
    id: '123',
    preferences: {
      theme: 'light',
    },
  };
}

/**
 * "Property does not exist on type"
 */
{
  const user1 = {
    name: 'Matt',
  };

  // Property 'age' does not exist on type '{ name: string; }'
  user1.age = 24;

  /**
   * First solution: Declaring a type definition with the property as optional
   */
  type User = {
    name: string;
    age?: number;
  };

  const user2: User = {
    name: 'Laura',
  };

  user2.age = 24;

  /**
   * Second solution: Declaring a super wider type definition, more useful for dynamic objects
   */
  const user3: Record<string, number | string> = {
    name: 'John',
  };

  user3.age = 24;

  /**
   * Third solution: Rethinking about the object declaration, see if it's possible to declare that property inline
   */
  const user4 = {
    name: 'Rafael',
    age: 24,
  };
}

/**
 * "X is possibly null or undefined"
 */
{
  const searchParams = new URLSearchParams(window.location.search);

  const id = searchParams.get('id');

  // 'id' is possibly 'null'
  console.log(id.toUpperCase());

  /**
   * First solution: Using optional chaining
   */
  console.log(id?.toUpperCase());

  /**
   * Second solution (More likely unsafe): Using non-nullable assertion (TS only, not affects runtime)
   *
   * Only use if you are sure that those properties are always defined.
   */
  console.log(id!.toUpperCase());

  /**
   * Third solution: Narrowing it down with a conditional
   */
  if (id) {
    // `id` gets narrowed to `string`
    console.log(id.toUpperCase());
  }

  // or
  if (!id) {
    throw new Error('Id not found');
  }
}

/**
 * "Types of property are incompatible"
 */
{
  const routingConfig1 = {
    routes: [
      {
        path: 'home',
        component: 'HomeComponent',
      },
      {
        path: 'about',
        component: 12,
      },
      {
        path: 'contact',
        component: 'ContactComponent',
      },
    ],
  };

  const createRoutes1 = (config: {
    routes: {
      path: string;
      component: string;
    }[];
  }) => {};

  // Types of property 'component' are incompatible.
  createRoutes1(routingConfig1);

  /**
   * The solutions below aim to get a more specific error in the `component`
   * property, instead of getting rid of the error completely.
   */

  /**
   * First solution: Passing the object inline, which improves inference.
   */
  createRoutes1({
    routes: [
      {
        path: 'home',
        component: 'HomeComponent',
      },
      {
        path: 'about',
        component: 12,
      },
      {
        path: 'contact',
        component: 'ContactComponent',
      },
    ],
  });

  type RoutingConfig = {
    routes: {
      path: string;
      component: string;
    }[];
  };

  /**
   * Second solution: Create a type definition for the config object
   */
  const routingConfig2: RoutingConfig = {
    routes: [
      {
        path: 'home',
        component: 'HomeComponent',
      },
      {
        path: 'about',
        component: 12,
      },
      {
        path: 'contact',
        component: 'ContactComponent',
      },
    ],
  };

  /**
   * Third solution: Using `satisfies`
   */
  const routingConfig3 = {
    routes: [
      {
        path: 'home',
        component: 'HomeComponent',
      },
      {
        path: 'about',
        component: 12,
      },
      {
        path: 'contact',
        component: 'ContactComponent',
      },
    ],
  } satisfies RoutingConfig;
}

/**
 * "X is of type unknown"
 */
{
  const somethingDangerous = () => {
    if (Math.random() > 0.5) {
      throw new Error('Oh dear!');
    }
  };

  try {
    somethingDangerous();
  } catch (error) {
    console.log(error.message);
  }

  /**
   * First solution: Narrowing with `as` - unsafe
   */
  try {
    somethingDangerous();
  } catch (error) {
    console.log((error as Error).message);
  }

  /**
   * Second solution: Narrowing with conditional checks
   */
  try {
    somethingDangerous();
  } catch (error) {
    if (typeof error === 'object' && error && 'message' in error) {
      console.log(error.message);
    } else {
      throw error;
    }
  }

  try {
    somethingDangerous();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      throw error;
    }
  }
}
