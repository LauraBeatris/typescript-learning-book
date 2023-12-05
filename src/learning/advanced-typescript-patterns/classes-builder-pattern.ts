import { Equal, Expect } from '../../test-utils';

/**
 * Using classes in TypeScript
 */
{
  class CustomError extends Error {
    constructor(
      message: string,
      public code: number,
    ) {
      super(message);
      this.name = 'CustomError';
    }
  }

  const handleCustomError = (error: CustomError) => {
    console.error(error.code);

    type test = Expect<Equal<typeof error.code, number>>;
  };
}

/**
 * Classes with type predicates
 */
{
  class Form<TValues> {
    error?: string;

    constructor(
      public values: TValues,
      private validate: (values: TValues) => string | void,
    ) {}

    // Or: this is Form<TValues> & { error: string }
    isInvalid(): this is this & { error: string } {
      const result = this.validate(this.values);

      if (typeof result === 'string') {
        this.error = result;
        return true;
      }

      this.error = undefined;

      return false;
    }
  }

  const form = new Form(
    {
      username: '',
      password: '',
    },
    (values) => {
      if (!values.username) {
        return 'Username is required';
      }

      if (!values.password) {
        return 'Password is required';
      }
    },
  );

  if (form.isInvalid()) {
    type test1 = Expect<Equal<typeof form.error, string>>;
  } else {
    type test2 = Expect<Equal<typeof form.error, string | undefined>>;
  }
}

/**
 * Classes with assertion functions
 */
{
  interface User {
    id: string;
  }

  class SDK {
    loggedInUser?: User;

    constructor(loggedInUser?: User) {
      this.loggedInUser = loggedInUser;
    }

    // Or: asserts this is SDK & { loggedInUser: User }
    assertIsLoggedIn(): asserts this is this & { loggedInUser: User } {
      if (!this.loggedInUser) {
        throw new Error('Not logged in');
      }
    }

    createPost(title: string, body: string) {
      type test1 = Expect<Equal<typeof this.loggedInUser, User | undefined>>;

      this.assertIsLoggedIn();

      type test2 = Expect<Equal<typeof this.loggedInUser, User>>;
    }
  }
}

/**
 * Class implementation following the builder pattern
 */
{
  class BuilderTuple<TList extends any[] = []> {
    list: TList;

    constructor() {
      this.list = [] as any;
    }

    push<TNum extends number>(num: TNum): BuilderTuple<[...TList, TNum]> {
      this.list.push(num);

      return this as any;
    }

    unshift<TNum extends number>(num: TNum): BuilderTuple<[TNum, ...TList]> {
      this.list.unshift(num);

      return this as any;
    }
  }
}

/**
 * Getters and setters in the builder pattern
 */
{
  class TypeSafeStringMap<TMap extends Record<string, string> = {}> {
    private map: TMap;

    constructor() {
      this.map = {} as TMap;
    }

    get(key: keyof TMap): string {
      return this.map[key];
    }

    set<K extends string>(
      key: K,
      value: string,
    ): TypeSafeStringMap<TMap & Record<K, string>> {
      (this.map[key] as any) = value;

      return this;
    }
  }

  const map = new TypeSafeStringMap()
    .set('matt', 'pocock')
    .set('jools', 'holland')
    .set('brandi', 'carlile');

  // Should not allow getting values which do not exist
  map.get(
    // @ts-expect-error
    'jim',
  );
}

/**
 * Default generics in the builder pattern
 */
{
  type Example = keyof {} | keyof { matt: string } | keyof { jools: string };

  // The default {} generic here ensures type safety when starting the builder pattern
  class TypeSafeStringMap<TMap extends Record<string, string> = {}> {
    private map: TMap;
    constructor() {
      this.map = {} as TMap;
    }

    get(key: keyof TMap): string {
      return this.map[key];
    }

    set<K extends string>(
      key: K,
      value: string,
    ): TypeSafeStringMap<TMap & Record<K, string>> {
      (this.map[key] as any) = value;

      return this;
    }
  }

  const map = new TypeSafeStringMap()
    .set('matt', 'pocock')
    .set('jools', 'holland')
    .set('brandi', 'carlile');

  map.get(
    // @ts-expect-error
    'jim',
  );
}
