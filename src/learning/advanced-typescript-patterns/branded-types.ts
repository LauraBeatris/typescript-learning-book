declare const brand: unique symbol;

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
