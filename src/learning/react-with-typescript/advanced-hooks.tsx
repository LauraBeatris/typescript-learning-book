import { Equal, Expect } from '../../support/test-utils';

/**
 * Fixing type inference in a custom React hook
 *
 * Solution: Using `as const` to infer a tuple return type
 */
{
  const useId = (defaultId: string) => {
    const [id, setId] = React.useState(defaultId);

    return [id, setId] as const;
  };

  const [id, setId] = useId('1');

  type tests = [
    Expect<Equal<typeof id, string>>,
    Expect<Equal<typeof setId, React.Dispatch<React.SetStateAction<string>>>>,
  ];
}

/**
 * Strongly typing React context
 *
 * Solution: Using type arguments to create a strongly typed context
 */
{
  const createRequiredContext = <TContext,>() => {
    const context = React.createContext<TContext | null>(null);

    const useContext = (): TContext => {
      const contextValue = React.useContext(context);

      if (contextValue === null) {
        throw new Error('Context value is null');
      }

      return contextValue;
    };

    return [useContext, context.Provider] as const;
  };

  const [useUser, UserProvider] = createRequiredContext<{
    name: string;
  }>();

  const [useTheme, ThemeProvider] = createRequiredContext<{
    primaryColor: string;
  }>();

  const Child = () => {
    const user = useUser();

    type test = Expect<
      Equal<
        typeof user,
        {
          name: string;
        }
      >
    >;

    const theme = useTheme();

    type test2 = Expect<
      Equal<
        typeof theme,
        {
          primaryColor: string;
        }
      >
    >;

    return null;
  };

  const Parent = () => {
    return (
      <>
        <UserProvider value={{ name: 'Matt' }}>
          <ThemeProvider value={{ primaryColor: 'blue' }}>
            <Child />
          </ThemeProvider>
 </UserProvider>
      </>
    );
  };
}
