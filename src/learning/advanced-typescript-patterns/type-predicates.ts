import { Equal, Expect } from '../../test-utils';

/**
 * Using a type predicate to filter types
 */
{
  const predicate = (value?: string): value is string => Boolean(value);

  const values = ['a', 'b', undefined, 'c', undefined];

  const filteredValues = values.filter(predicate);

  type Tests = [Expect<Equal<typeof filteredValues, string[]>>];
}

/**
 * Ensuring valid types with an assertion function
 */
{
  interface User {
    id: string;
    name: string;
  }
  
  interface AdminUser extends User {
    role: "admin";
    organisations: string[];
  }
  
  interface NormalUser extends User {
    role: "normal";
  }

  /**
   * @ref https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
   */
  function assertUserIsAdmin(user: NormalUser | AdminUser): asserts user is AdminUser {
    if (user.role !== "admin") {
      throw new Error("Not an admin user");
    }
  }

  const example = (user: NormalUser | AdminUser) => {
    assertUserIsAdmin(user);

    type Tests = [Expect<Equal<typeof user, AdminUser>>];
  };
}

/**
 * Declaring assertion functions properly to avoid confusing errors
 */
{
  interface User {
    id: string;
    name: string;
  }
  
  interface AdminUser extends User {
    role: "admin";
    organisations: string[];
  }
  
  interface NormalUser extends User {
    role: "normal";
  }

  /**
   * Compiler error -> "Assertions require every name in the call target 
   * to be declared with an explicit type annotation."
   */
  // const assertUserIsAdmin = (
  //   user: NormalUser | AdminUser,
  // ): asserts user is AdminUser => {
  //   if (user.role !== "admin") {
  //     throw new Error("Not an admin user");
  //   }
  // };

  /**
   * Make sure to declare assertions functions with the "function keyword"
   */
  function assertUserIsAdmin(
    user: NormalUser | AdminUser,
  ): asserts user is AdminUser {
    if (user.role !== "admin") {
      throw new Error("Not an admin user");
    }
  };

  const example = (user: NormalUser | AdminUser) => {
    assertUserIsAdmin(user);

    type tests = [Expect<Equal<typeof user, AdminUser>>];
  };
}
