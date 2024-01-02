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
