import { ChangeEventHandler } from 'react';
import { Equal, Expect } from '../../support/test-utils';

/**
 * Implement a generic type helper
 */
{
  type Icon = 'home' | 'settings' | 'about';
  type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

  /**
   * This type is a generic helper that allows for autocomplete functionality.
   * It takes a type T and extends it to include any string, while still providing
   * autocomplete suggestions for the original type T.
   */
  type LooseAutocomplete<T> = T | (string & {});

  // // How do we refactor this to make it DRY?
  // type LooseIcon = Icon | (string & {});
  // type LooseButtonVariant = ButtonVariant | (string & {});

  type LooseIcon = LooseAutocomplete<Icon>;
  type LooseButtonVariant = LooseAutocomplete<ButtonVariant>;

  const icons: LooseIcon[] = [
    'home',
    'settings',
    'about',
    'any-other-string',
    // I should get autocomplete if I add a new item here!
  ];

  const buttonVariants: LooseButtonVariant[] = [
    'primary',
    'secondary',
    'tertiary',
    'any-other-string',
    // I should get autocomplete if I add a new item here!
  ];
}

/**
 * Creating an "All or Nothing" type helper for React props
 */
{
  // type InputProps = (
  //   | {
  //       value: string;
  //       onChange: ChangeEventHandler;
  //     }
  //   | {
  //       value?: undefined;
  //       onChange?: undefined;
  //     }
  // ) & {
  //   label: string;
  // };

  type ToUndefinedObject<T extends Record<string, unknown>> = Record<
    keyof T,
    undefined
  >;

  type AllOrNothing<T extends Record<string, unknown>> =
    | T
    | Partial<ToUndefinedObject<T>>;

  type InputProps = AllOrNothing<{
    value: string;
    onChange: ChangeEventHandler;
  }> & {
    label: string;
  };

  const Input = ({ label, ...props }: InputProps) => {
    return (
      <div>
        <label>
          {label}
          <input {...props} />
        </label>
      </div>
    );
  };
}

/**
 * Constraining a type helper to accept specific values
 */
{
  // Those types helpers are allowing to pass anything as T, and
  // we want to constrain it to that it only works with objects
  // type ToUndefinedObject<T> = Record<keyof T, undefined>;
  // type AllOrNothing<T> = T | Partial<ToUndefinedObject<T>>;

  type ToUndefinedObject<T extends Record<string, unknown>> = Record<
    keyof T,
    undefined
  >;
  type AllOrNothing<T extends Record<string, any>> =
    | T
    | Partial<ToUndefinedObject<T>>;

  type Tests = [
    // @ts-expect-error
    AllOrNothing<string>,
    // @ts-expect-error
    AllOrNothing<number>,
    // @ts-expect-error
    AllOrNothing<undefined>,
    Expect<
      Equal<AllOrNothing<{ a: string }>, { a: string } | { a?: undefined }>
    >,
  ];
}

/**
 * Adding type arguments to a hook
 */
{
  function useLocalStorage<TValue>(prefix: string) {
    return {
      get: (key: string): TValue | null => {
        return JSON.parse(window.localStorage.getItem(prefix + key) || 'null');
      },
      set: (key: string, value: TValue) => {
        window.localStorage.setItem(prefix + key, JSON.stringify(value));
      },
    };
  }

  // Should let you set and get values
  const user = useLocalStorage<{ name: string }>('user');

  user.set('matt', { name: 'Matt' });

  const mattUser = user.get('matt');

  type Tests = [Expect<Equal<typeof mattUser, { name: string } | null>>];

  // Should not let you set a value that is not the same type as the type argument passed
  user.set(
    'something',
    // @ts-expect-error
    {},
  );
}

/**
 * Type inference with generic functions
 */
{
  function useStateAsObject<TState>(initial: TState) {
    const [value, set] = React.useState(initial);

    return {
      value,
      set,
    };
  }

  // Inferring from the runtime argument
  const example = useStateAsObject({ name: 'Matt' });

  type Tests1 = [
    Expect<Equal<typeof example.value, { name: string }>>,
    Expect<
      Equal<
        typeof example.set,
        React.Dispatch<React.SetStateAction<{ name: string }>>
      >
    >,
  ];

  const num = useStateAsObject(2);

  type Tests2 = [
    Expect<Equal<typeof num.value, number>>,
    Expect<Equal<typeof num.set, React.Dispatch<React.SetStateAction<number>>>>,
  ];
}
