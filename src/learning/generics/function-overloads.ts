import { Equal, Expect } from '../../test-utils';

/**
 * Understanding function overloads
 *
 * Implementation signature vs function signature
 */
{
  function returnWhatIPassIn(t: 1): 1;
  function returnWhatIPassIn(t: 'matt'): 'matt';
  function returnWhatIPassIn(t: unknown): unknown {
    return t;
  }

  const one = returnWhatIPassIn(1);
  const matt = returnWhatIPassIn('matt');

  type Tests = [
    Expect<Equal<typeof one, 1>>,
    Expect<Equal<typeof matt, 'matt'>>,
  ];
}

/**
 * Match return types with function overloads
 *
 * Tips: When doing a implementation signature, make sure to define a return type
 * that matches the function signatures ones. This is due for function overloads
 * not being that type safety.
 */
{
  function youSayGoodbyeISayHello(greeting: 'hello'): 'goodbye';
  function youSayGoodbyeISayHello(greeting: 'goodbye'): 'hello';
  function youSayGoodbyeISayHello(
    greeting: 'hello' | 'goodbye',
  ): 'goodbye' | 'hello' {
    return greeting === 'goodbye' ? 'hello' : 'goodbye';
  }

  const result1 = youSayGoodbyeISayHello('hello');
  const result2 = youSayGoodbyeISayHello('goodbye');

  type Tests = [
    Expect<Equal<typeof result1, 'goodbye'>>,
    Expect<Equal<typeof result2, 'hello'>>,
  ];
}

/**
 * Specifying types for an overloaded function
 */
{
  interface AnonymousPrivileges {
    sitesCanVisit: string[];
  }

  interface UserPrivileges extends AnonymousPrivileges {
    sitesCanEdit: string[];
  }

  interface AdminPrivileges extends UserPrivileges {
    sitesCanDelete: string[];
  }

  type Privileges = AnonymousPrivileges | UserPrivileges | AdminPrivileges;

  function getRolePrivileges(role: 'admin'): AdminPrivileges;
  function getRolePrivileges(role: 'user'): UserPrivileges;
  function getRolePrivileges(role: string): AnonymousPrivileges;
  function getRolePrivileges(role: string): Privileges {
    switch (role) {
      case 'admin':
        return {
          sitesCanDelete: [],
          sitesCanEdit: [],
          sitesCanVisit: [],
        };
      case 'user':
        return {
          sitesCanEdit: [],
          sitesCanVisit: [],
        };
      default:
        return {
          sitesCanVisit: [],
        };
    }
  }

  const adminPrivileges = getRolePrivileges('admin');
  const userPrivileges = getRolePrivileges('user');
  const anonymousPrivileges = getRolePrivileges('anonymous');

  type Tests = [
    Expect<Equal<typeof adminPrivileges, AdminPrivileges>>,
    Expect<Equal<typeof userPrivileges, UserPrivileges>>,
    Expect<Equal<typeof anonymousPrivileges, AnonymousPrivileges>>,
  ];
}

/**
 * When to use unions instead of overloads
 */
{
  // TODO: Apply typing for generator argument
  // function runGenerator(generator: unknown) {
  //   if (typeof generator === "function") {
  //     return generator();
  //   }
  //   return generator.run();
  // }

  type Generator = {
    run: () => string;
  };

  /**
   * It's not worth to use function overloading here, considering that the
   * return type doesn't change based on the argument
   */
  function runGenerator1<T extends Generator>(
    generator: T,
  ): ReturnType<T['run']>;
  function runGenerator1<T extends Generator['run']>(
    generator: T,
  ): ReturnType<T>;
  function runGenerator1(generator: Generator | Generator['run']): string {
    if (typeof generator === 'function') {
      return generator();
    }
    return generator.run();
  }

  /**
   * Solution with union types, much cleaner to read. The result type is
   * always the same no matter what's the combination of arguments
   */
  function runGenerator2(generator: Generator | Generator['run']): string {
    if (typeof generator === 'function') {
      return generator();
    }
    return generator.run();
  }

  const result1 = runGenerator1({
    run: () => 'hello',
  });

  const result2 = runGenerator1(() => 'hello');

  const result3 = runGenerator1({
    run: () => 'hello',
  });

  const result4 = runGenerator1(() => 'hello');

  type Tests = [
    Expect<Equal<typeof result1, string>>,
    Expect<Equal<typeof result2, string>>,
    Expect<Equal<typeof result3, string>>,
    Expect<Equal<typeof result4, string>>,
  ];
}

/**
 * Typing different function use cases with overloads and generics
 *
 * Generics can be used in different function signatures to map different type
 * arguments setups
 */
{
  function returnWhatIPassInExceptFor1(t: 1): 2;
  function returnWhatIPassInExceptFor1<T>(t: T): T;
  function returnWhatIPassInExceptFor1(t: unknown): unknown {
    if (t === 1) {
      return 2;
    }

    return t;
  }

  const result = returnWhatIPassInExceptFor1(1);

  const a = returnWhatIPassInExceptFor1('a');
  const b = returnWhatIPassInExceptFor1('b');
  const c = returnWhatIPassInExceptFor1('c');

  type Tests = [
    Expect<Equal<typeof result, 2>>,
    Expect<Equal<typeof a, 'a'>>,
    Expect<Equal<typeof b, 'b'>>,
    Expect<Equal<typeof c, 'c'>>,
  ];
}

/**
 * Dealing with different generic signatures and different function overload signatures
 */
{
  const divElement = document.querySelector('div');
  const spanElement = document.querySelector('span');

  // Type inference is resolving to Element | null instead of HTMLDivElement
  // const divElement2 = document.querySelector("div.foo");

  const divElement2 = document.querySelector<HTMLDivElement>('div.foo');

  type Tests = [
    Expect<Equal<typeof divElement, HTMLDivElement | null>>,
    Expect<Equal<typeof spanElement, HTMLSpanElement | null>>,
    Expect<Equal<typeof divElement2, HTMLDivElement | null>>,
  ];
}
