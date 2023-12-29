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

/**
 * Using discriminated unions in `useState`
 */
{
  type State =
    | {
        status: 'error';
        error: Error;
      }
    | {
        status: 'loading';
      }
    | {
        status: 'loaded';
      };

  const useLoadAsyncVideo = (src: string) => {
    const [state, setState] = React.useState<State>({
      status: 'loading',
    });

    React.useEffect(() => {
      setState({ status: 'loading' });

      let cancelled = false;

      fetchVideo(src)
        .then((blob) => {
          if (cancelled) {
            return;
          }

          appendVideoToDomAndPlay(blob);

          setState({ status: 'loaded' });
        })
        .catch((error) => {
          if (cancelled) {
            return;
          }
          setState({ status: 'error', error });
        });

      return () => {
        cancelled = true;
      };
    }, [src]);

    // @ts-expect-error
    setState({ status: 'error' });

    // @ts-expect-error
    setState({ status: 'loading', error: new Error('error') });

    // @ts-expect-error
    setState({ status: 'loaded', error: new Error('error') });

    if (state.status === 'error') {
      console.error(state.error);
    }
  };
}

/**
 * Discriminated tuples in custom hooks
 */
{
  // type Result<T> = [
  //   "loading" | "success" | "error",
  //   T | Error | undefined,
  // ];

  type Result<T> = ['loading', undefined] | ['error', Error] | ['success', T];

  const useData = <T,>(url: string): Result<T> => {
    const [result, setResult] = React.useState<Result<T>>([
      'loading',
      undefined,
    ]);

    React.useEffect(() => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => setResult(['success', data]))
        .catch((error) => setResult(['error', error]));
    }, [url]);

    return result;
  };

  const Component = () => {
    const [status, value] = useData<{ title: string }>(
      'https://jsonplaceholder.typicode.com/todos/1',
    );

    if (status === 'loading') {
      return <div>Loading...</div>;
    }

    if (status === 'error') {
      return <div>Error: {value.message}</div>;
    }

    return <div>{value.title}</div>;
  };
}

/**
 * Use function overloads for better type inference
 */
{
  function maybeReturnsString(): string | undefined;
  function maybeReturnsString(defaultString?: string | undefined): string;
  function maybeReturnsString(defaultString?: string) {
    // If you pass a string, it always returns a string
    if (defaultString) {
      return defaultString;
    }

    // Otherwise, it MIGHT return a string or undefined
    return Math.random() > 0.5 ? 'hello' : undefined;
  }

  const example1 = maybeReturnsString('hello');
  const example2 = maybeReturnsString();

  type Tests = [
    Expect<Equal<typeof example1, string>>,
    Expect<Equal<typeof example2, string | undefined>>,
  ];
}

/**
 * Mimicking `useState` behavior with function overloads
 *
 * Solution: Wrapping `useState` functionality with function overloads
 */
{
  function useStateAsObject<T>(initial: T): {
    value: T;
    set: React.Dispatch<React.SetStateAction<T>>;
  };
  function useStateAsObject<T = undefined>(): {
    value: T | undefined;
    set: React.Dispatch<React.SetStateAction<T | undefined>>;
  };
  function useStateAsObject<T>(initial?: T) {
    const [value, set] = React.useState(initial);

    return {
      value,
      set,
    };
  }

  /**
   * If you DO pass a default value, the result should NOT include undefined
   */
  const notUndefined = useStateAsObject({ name: 'Matt' });

  type Tests1 = [
    Expect<Equal<typeof notUndefined.value, { name: string }>>,
    Expect<
      Equal<
        typeof notUndefined.set,
        React.Dispatch<React.SetStateAction<{ name: string }>>
      >
    >,
  ];

  /**
   * If you don't pass a value, it should be undefined
   */
  const hasUndefined = useStateAsObject<number>();

  type Tests2 = [
    Expect<Equal<typeof hasUndefined.value, number | undefined>>,
    Expect<
      Equal<
        typeof hasUndefined.set,
        React.Dispatch<React.SetStateAction<number | undefined>>
      >
    >,
  ];
}
