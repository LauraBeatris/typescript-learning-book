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
