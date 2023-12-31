import { Equal, Expect } from '../../support/test-utils';
import { Brand } from './branded-types';

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
    role: 'admin';
    organisations: string[];
  }

  interface NormalUser extends User {
    role: 'normal';
  }

  /**
   * @ref https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
   */
  function assertUserIsAdmin(
    user: NormalUser | AdminUser,
  ): asserts user is AdminUser {
    if (user.role !== 'admin') {
      throw new Error('Not an admin user');
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
    role: 'admin';
    organisations: string[];
  }

  interface NormalUser extends User {
    role: 'normal';
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
    if (user.role !== 'admin') {
      throw new Error('Not an admin user');
    }
  }

  const example = (user: NormalUser | AdminUser) => {
    assertUserIsAdmin(user);

    type tests = [Expect<Equal<typeof user, AdminUser>>];
  };
}

/**
 * Filtering with type predicates and generics
 */
{
  const isDivElement = (element: unknown): element is HTMLDivElement => {
    return element instanceof HTMLDivElement;
  };

  const isAnchorElement = (element: unknown): element is HTMLAnchorElement => {
    return element instanceof HTMLAnchorElement;
  };

  const isBodyElement = (element: unknown): element is HTMLBodyElement => {
    return element instanceof HTMLBodyElement;
  };

  interface DOMNodeExtractorConfig<T, Result> {
    isNode: (node: unknown) => node is T;
    transform: (node: T) => Result;
  }

  const createDOMNodeExtractor = <T, TResult>(
    config: DOMNodeExtractorConfig<T, TResult>,
  ) => {
    return (nodes: T[]): TResult[] => {
      return nodes.filter(config.isNode).map(config.transform);
    };
  };

  // Should pick up that `extractDivs` is of type `HTMLDivElement[]`
  const extractDivs = createDOMNodeExtractor({
    isNode: isDivElement,

    transform: (div) => {
      type test1 = Expect<Equal<typeof div, HTMLDivElement>>;
      return div.innerText;
    },
  });

  const extractAnchors = createDOMNodeExtractor({
    isNode: isAnchorElement,

    transform: (a) => {
      type test1 = Expect<Equal<typeof a, HTMLAnchorElement>>;
      return a.innerText;
    },
  });

  const divs = extractDivs([document.createElement('div')]);

  type test2 = Expect<Equal<typeof divs, string[]>>;
}

/**
 * Combining brands and type predicates
 */
{
  type Valid<T> = Brand<T, 'Valid'>;

  interface PasswordValues {
    password: string;
    confirmPassword: string;
  }

  const isValidPassword = (
    values: PasswordValues,
  ): values is Valid<PasswordValues> => {
    if (values.password !== values.confirmPassword) {
      return false;
    }
    return true;
  };

  const createUserOnApi = (values: Valid<PasswordValues>) => {
    // Imagine this function creates the user on the API
  };

  // Should fail if you do not validate the values before calling createUserOnApi
  const onSubmitHandler1 = (values: PasswordValues) => {
    // @ts-expect-error
    createUserOnApi(values);
  };

  // Should succeed if you DO validate the values before calling createUserOnApi
  const onSubmitHandler2 = (values: PasswordValues) => {
    if (isValidPassword(values)) {
      createUserOnApi(values);
    }
  };
}

/**
 * Combining brands and assertions
 */
{
  type Valid<T> = Brand<T, 'Valid'>;

  interface PasswordValues {
    password: string;
    confirmPassword: string;
  }

  function assertIsValidPassword(
    values: PasswordValues,
  ): asserts values is Valid<PasswordValues> {
    if (values.password !== values.confirmPassword) {
      throw new Error('Password is invalid');
    }
  }

  const createUserOnApi = (values: Valid<PasswordValues>) => {
    // Imagine this function creates the user on the API
  };

  // Should fail if you do not validate the passwords before calling createUserOnApi
  const onSubmitHandler1 = (values: PasswordValues) => {
    // @ts-expect-error
    createUserOnApi(values);
  };

  // Should succeed if you DO validate the passwords before calling createUserOnApi
  const onSubmitHandler2 = (values: PasswordValues) => {
    assertIsValidPassword(values);
    createUserOnApi(values);
  };
}
