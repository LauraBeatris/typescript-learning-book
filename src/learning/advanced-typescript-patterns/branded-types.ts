declare const brand: unique symbol;

/**
 * @ref https://www.typescriptlang.org/docs/handbook/symbols.html#unique-symbol
 */
type Brand<T, TBrand> = T & { [brand]: TBrand };

/**
 * Assigning branded types to values
 */
{
  type Password = Brand<string, 'Password'>;
  type Email = Brand<string, 'Email'>;

  /**
   * Turn raw values into branded types - "conversion function"
   */
  const validateValues = (values: { email: string; password: string }) => {
    if (!values.email.includes('@')) {
      throw new Error('Email invalid');
    }
    if (values.password.length < 8) {
      throw new Error('Password not long enough');
    }

    return {
      email: values.email as Email,
      password: values.password as Password,
    };
  };

  const createUserOnApi = (values: { email: Email; password: Password }) => {
    // Imagine this function creates the user on the API
  };

  const onSubmitHandler = (values: { email: string; password: string }) => {
    const validatedValues = validateValues(values);

    createUserOnApi(validatedValues);
  };
}

/**
 * Add branded types to functions and models
 */
{
  type UserId = Brand<string, 'UserId'>;
  type PostId = Brand<string, 'PostId'>;

  interface User {
    id: UserId;
    name: string;
  }

  interface Post {
    id: PostId;
    title: string;
    content: string;
  }

  const db: { users: User[]; posts: Post[] } = {
    users: [
      {
        id: '1' as UserId,
        name: 'Miles',
      },
    ],
    posts: [
      {
        id: '1' as PostId,
        title: 'Hello world',
        content: 'This is my first post',
      },
    ],
  };

  const getUserById = (id: UserId) => {
    return db.users.find((user) => user.id === id);
  };

  const getPostById = (id: PostId) => {
    return db.posts.find((post) => post.id === id);
  };

  const postId = '1' as PostId;

  // @ts-expect-error
  getUserById(postId);

  const userId = '1' as UserId;

  // @ts-expect-error
  getPostById(userId);
}

/**
 * Combine type helpers with branded types
 */
{
  type Valid<T> = Brand<T, 'Valid'>;

  interface PasswordValues {
    password: string;
    confirmPassword: string;
  }

  const validatePassword = (values: PasswordValues) => {
    if (values.password !== values.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    return values as Valid<PasswordValues>;
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
    const validatedValues = validatePassword(values);
    createUserOnApi(validatedValues);
  };
}
