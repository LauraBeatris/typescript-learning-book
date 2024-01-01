import { ChangeEventHandler } from 'react';
import { Equal, Expect } from '../../support/test-utils';
import { createPost, createUser } from '../../support/helpers';

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

/**
 * Applying generics to components
 */
{
  interface TableProps<TRow> {
    rows: TRow[];
    renderRow: (row: TRow) => React.ReactNode;
  }

  function Table<TRow>(props: TableProps<TRow>) {
    return (
      <table>
        <tbody>
          {props.rows.map((row) => (
            <tr>{props.renderRow(row)}</tr>
          ))}
        </tbody>
      </table>
    );
  }

  const data = [
    {
      id: 1,
      name: 'John',
    },
  ];

  const Parent = () => {
    return (
      <div>
        <Table rows={data} renderRow={(row) => <td>{row.name}</td>} />
        <Table
          rows={data}
          renderRow={(row) => {
            type Tests = [
              Expect<Equal<typeof row, { id: number; name: string }>>,
            ];
            return (
              <td>
                {
                  // @ts-expect-error
                  row.doesNotExist
                }
              </td>
            );
          }}
        ></Table>
      </div>
    );
  };
}

/**
 * Generics in class components
 */
{
  interface TableProps<TRow> {
    rows: TRow[];
    renderRow: (row: TRow) => React.ReactNode;
  }

  class Table<TRow> extends React.Component<TableProps<TRow>> {
    render(): React.ReactNode {
      return (
        <table>
          <tbody>
            {this.props.rows.map((row) => (
              <tr>{this.props.renderRow(row)}</tr>
            ))}
          </tbody>
        </table>
      );
    }
  }

  const data = [
    {
      id: 1,
      name: 'John',
    },
  ];

  const Parent = () => {
    return (
      <div>
        <Table rows={data} renderRow={(row) => <td>{row.name}</td>} />
        <Table
          rows={data}
          renderRow={(row) => {
            type Tests = [
              Expect<Equal<typeof row, { id: number; name: string }>>,
            ];
            return (
              <td>
                {
                  // @ts-expect-error
                  row.doesNotExist
                }
              </td>
            );
          }}
        ></Table>
      </div>
    );
  };
}

/**
 * Passing type arguments to components
 */
{
  interface TableProps<TRow> {
    rows: TRow[];
    renderRow: (row: TRow) => React.ReactNode;
  }

  function Table<TRow>(props: TableProps<TRow>) {
    return (
      <table>
        <tbody>
          {props.rows.map((row) => (
            <tr>{props.renderRow(row)}</tr>
          ))}
        </tbody>
      </table>
    );
  }

  interface User {
    id: number;
    name: string;
    age: number;
  }

  <>
    <Table<User>
      // @ts-expect-error rows should be User[]
      rows={[1, 2, 3]}
      renderRow={(row) => {
        type Tests = [Expect<Equal<typeof row, User>>];
        return <td>{row.name}</td>;
      }}
    />
    <Table<User>
      rows={[
        {
          id: 1,
          name: 'John',
          age: 30,
        },
        {
          // @ts-expect-error id should be string
          id: '2',
          name: 'Jane',
          age: 30,
        },
      ]}
      renderRow={(row) => {
        type Tests = [Expect<Equal<typeof row, User>>];
        return <td>{row.name}</td>;
      }}
    ></Table>
  </>;
}

/**
 * Adding generic type arguments to type helpers
 */
{
  interface Button<TValue> {
    value: TValue;
    label: string;
  }

  interface ButtonGroupProps<TValue> {
    buttons: Button<TValue>[];
    onClick: (value: TValue) => void;
  }

  /**
   * In this exercise, we have a component called ButtonGroup. It takes an array
   * of buttons and a function to call when a button is clicked.
   *
   * We want to improve the type of the onClick function so that the value passed
   * to it is inferred from the buttons array.
   *
   * 1. Try to solve this problem using generics.
   */
  const ButtonGroup = <TValue extends string>(
    props: ButtonGroupProps<TValue>,
  ) => {
    return (
      <div>
        {props.buttons.map((button) => {
          return (
            <button
              key={button.value}
              onClick={() => {
                props.onClick(button.value);
              }}
            >
              {button.label}
            </button>
          );
        })}
      </div>
    );
  };

  <>
    <ButtonGroup
      onClick={(value) => {
        type Tests = [Expect<Equal<typeof value, 'add' | 'delete'>>];
      }}
      buttons={[
        {
          value: 'add',
          label: 'Add',
        },
        {
          value: 'delete',
          label: 'Delete',
        },
      ]}
    ></ButtonGroup>
  </>;
}

/**
 * Refactoring a generic hook for best inference
 */
{
  type Mutation<TArgs extends any[], TReturn> = (
    ...args: TArgs
  ) => Promise<TReturn>;

  interface UseMutationReturn<TArgs extends any[], TReturn> {
    mutate: Mutation<TArgs, TReturn>;
    isLoading: boolean;
  }

  interface UseMutationOptions<TArgs extends any[], TReturn> {
    mutation: Mutation<TArgs, TReturn>;
  }

  const useMutation = <TArgs extends any[], TReturn>(
    opts: UseMutationOptions<TArgs, TReturn>,
  ): UseMutationReturn<TArgs, TReturn> => {
    const [isLoading, setIsLoading] = React.useState(false);

    return {
      mutate: async (...args) => {
        setIsLoading(true);

        try {
          const result = await opts.mutation(...args);
          return result;
        } catch (e) {
          throw e;
        } finally {
          setIsLoading(false);
        }
      },
      isLoading,
    };
  };

  const mutation = useMutation({
    mutation: createUser,
  });

  mutation.mutate({ name: 'John Doe', email: 'john@doe.com' });

  // @ts-expect-error email missing!
  mutation.mutate({ name: 'John Doe' });

  mutation.mutate(
    {
      name: 'John Doe',
      email: 'john@doe.com',
    },
    {
      throwOnError: true,
      // @ts-expect-error extra prop
      extra: 'oh dear',
    },
  );

  type Tests = [
    Expect<Equal<typeof mutation.isLoading, boolean>>,
    Expect<
      Equal<
        typeof mutation.mutate,
        (
          user: { name: string; email: string },
          opts?: {
            throwOnError?: boolean;
          },
        ) => Promise<{
          id: string;
          name: string;
          email: string;
        }>
      >
    >,
  ];
}

/**
 * Refactoring from generics to a discriminated union
 */
{
  // type ModalProps<TVariant extends PossibleVariants> = {
  //   isOpen: boolean;
  //   variant: TVariant;
  // } & (TVariant extends "with-button"
  //   ? {
  //       buttonLabel: string;
  //       onButtonClick: () => void;
  //     }
  //   : {});

  // type PossibleVariants = 'with-button' | 'without-button';

  type ModalProps = (
    | {
        variant: 'with-button';
        buttonLabel: string;
        onButtonClick: () => void;
      }
    | {
        variant: 'without-button';
      }
  ) & {
    isOpen: boolean;
  };

  const Modal = (props: ModalProps) => {
    return null;
  };

  const Parent = () => {
    return (
      <>
        <Modal
          isOpen
          variant="with-button"
          buttonLabel="Click Me!"
          onButtonClick={() => {}}
        ></Modal>
        <Modal isOpen variant="without-button"></Modal>

        {/* @ts-expect-error */}
        <Modal isOpen variant="with-button"></Modal>

        <Modal
          isOpen
          variant="without-button"
          /* @ts-expect-error */
          onButtonClick={() => {}}
        />
      </>
    );
  };
}
