import { appendVideoToDomAndPlay, fetchVideo } from '../../support/helpers';
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

/**
 * Using TypeScript to manage complex state
 *
 * Solution: Handling complex state management with unions
 */
{
  type State = 'loading' | 'loaded' | 'error';

  const useLoadAsyncVideo = (src: string) => {
    const [state, setState] = React.useState<State>('loading');

    React.useEffect(() => {
      setState('loading');

      let cancelled = false;

      fetchVideo(src)
        .then((blob) => {
          if (cancelled) {
            return;
          }

          appendVideoToDomAndPlay(blob);

          setState('loaded');
        })
        .catch((error) => {
          if (cancelled) {
            return;
          }
          setState('error');
        });

      return () => {
        cancelled = true;
      };
    }, [src]);

    // @ts-expect-error
    if (state === 'does-not-exist') {
    }

    if (state === 'loading') {
      return 'loading...';
    }

    if (state === 'loaded') {
      return 'loaded';
    }

    if (state === 'error') {
      return 'Error!';
    }

    // state should equal never! Because we've covered all the cases
    type Tests = Expect<Equal<typeof state, never>>;
  };
}
