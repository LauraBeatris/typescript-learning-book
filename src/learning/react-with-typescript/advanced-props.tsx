import { Equal, Expect } from '../../support/test-utils';

/**
 * Using discriminated unions to create flexible component props
 */
{
  /**
   * 1. Currently, ModalProps lets you pass in various impossible combinations of props.
   *
   * For instance, you can pass in a `variant` of "title" without passing in a title,
   * or you can pass in a `variant` of "no-title" WITH a title.
   *
   * Try to find a way to express ModalProps so that it's impossible to pass in
   * impossible combinations of props.
   */
  // type ModalProps = {
  //   variant: 'no-title' | 'title';
  //   title?: string;
  // };

  type ModalProps =
    | {
        variant: 'title';
        title: string;
      }
    | {
        variant: 'no-title';
      };

  const Modal = (props: ModalProps) => {
    if (props.variant === 'no-title') {
      return <div>No title</div>;
    } else {
      return <div>Title: {props.title}</div>;
    }
  };

  const Test = () => {
    return (
      <div>
        <Modal variant="title" title="Hello" />
        <Modal variant="no-title" />

        {/* @ts-expect-error */}
        <Modal />
        <Modal
          variant="no-title"
          // @ts-expect-error
          title="Oh dear"
        />
      </div>
    );
  };
}

/**
 * Destructuring discriminated unions in React props
 */
{
  type ModalProps =
    | {
        variant: 'no-title';
      }
    | {
        variant: 'title';
        title: string;
      };

  // @ts-expect-error
  const ModalExample = ({ variant, title }: ModalProps) => {
    if (variant === 'no-title') {
      return <div>No title</div>;
    } else {
      return <div>Title: {title}</div>;
    }
  };

  const Modal = (props: ModalProps) => {
    // Narrowing
    if (props.variant === 'no-title') {
      return <div>No title</div>;
    } else {
      const { title } = props;
      return <div>Title: {title}</div>;
    }
  };

  const Test = () => {
    return (
      <div>
        <Modal variant="title" title="Hello" />
        <Modal variant="no-title" />

        {/* @ts-expect-error */}
        <Modal />
        <Modal
          variant="no-title"
          // @ts-expect-error
          title="Oh dear"
        />
      </div>
    );
  };
}

/**
 * Adding a prop required across discriminated union variants
 */
{
  type ModalProps = {
    buttonColor: string;
  } & (
    | {
        variant: 'no-title';
      }
    | {
        variant: 'title';
        title: string;
      }
  );

  // Better readability
  //   type VariantModalProps = | {
  //     variant: 'no-title';
  //   }
  // | {
  //     variant: 'title';
  //     title: string;
  //   }

  //   type ModalProps = VariantModalProps & {
  //     buttonColor: string;
  //   };

  const Modal = (props: ModalProps) => {
    if (props.variant === 'no-title') {
      return (
        <div>
          <span>No title</span>
          <button
            style={{
              backgroundColor: props.buttonColor,
            }}
          >
            Click me!
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <span>Title: {props.title}</span>
          <button
            style={{
              backgroundColor: props.buttonColor,
            }}
          >
            Click me!
          </button>
        </div>
      );
    }
  };

  const Test = () => {
    return (
      <div>
        {/* @ts-expect-error */}
        <Modal buttonColor="red" />
        <Modal
          buttonColor="red"
          variant="no-title"
          // @ts-expect-error
          title="Oh dear"
        />
        <Modal variant="title" title="Hello" buttonColor="red" />
      </div>
    );
  };
}

/**
 * Differentiating props with a boolean discriminator
 */
{
  // type EmbeddedPlaygroundProps = {
  //   useStackblitz?: boolean;
  //   stackblitzId?: string;
  //   codeSandboxId?: string;
  // };

  type EmbeddedPlaygroundProps =
    | {
        useStackblitz: true;
        stackblitzId: string;
      }
    | {
        useStackblitz?: false;
        codeSandboxId: string;
      };

  const EmbeddedPlayground = (props: EmbeddedPlaygroundProps) => {
    if (props.useStackblitz) {
      return (
        <iframe
          src={`https://stackblitz.com/edit/${props.stackblitzId}?embed=1`}
        />
      );
    }

    return (
      <iframe src={`https://codesandbox.io/embed/${props.codeSandboxId}`} />
    );
  };

  <>
    <EmbeddedPlayground useStackblitz stackblitzId="my-stackblitz-id" />
    <EmbeddedPlayground codeSandboxId="my-codesandbox-id" />

    <EmbeddedPlayground
      useStackblitz
      // @ts-expect-error
      codeSandboxId="my-codesandbox-id"
    />

    {/* @ts-expect-error */}
    <EmbeddedPlayground stackblitzId="my-stackblitz-id" />
  </>;
}

/**
 * Allowing optional props using a discriminated union branch with undefined types
 */
{
  // type InputProps = (
  //   | {
  //       value: string;
  //       onChange: React.ChangeEventHandler;
  //     }
  //   | {}
  // ) & {
  //   label: string;
  // };

  type InputProps = (
    | {
        value: string;
        onChange: React.ChangeEventHandler;
      }
    | {
        value?: undefined;
        onChange?: undefined;
      }
  ) & {
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

  const Test = () => {
    return (
      <div>
        <Input label="Greeting" value="Hello" onChange={() => {}} />
        <Input label="Greeting" />

        {/* @ts-expect-error */}
        <Input label="Greeting" value="Hello" />

        {/* @ts-expect-error */}
        <Input label="Greeting" onChange={() => {}} />
      </div>
    );
  };
}

/**
 * The difference between React.ReactNode and React.FC
 */
{
  // interface TableProps {
  //   renderRow: React.ReactNode;
  // }

  // interface TableProps {
  //   renderRow: (index: number) => React.ReactNode;
  // }

  interface TableProps {
    renderRow: React.FC<number>;
  }

  const Table = (props: TableProps) => {
    return <div>{[0, 1, 3].map(props.renderRow)}</div>;
  };

  const Parent = () => {
    return (
      <>
        <Table
          renderRow={(index) => {
            type test = Expect<Equal<typeof index, number>>;
            return <div key={index}>{index}</div>;
          }}
        />
        <Table
          renderRow={(index) => {
            return null;
          }}
        />
        <Table
          // @ts-expect-error
          renderRow={<div></div>}
        />
        <Table
          renderRow={(index) => {
            return index;
          }}
        />
      </>
    );
  };
}

/**
 * Syncing types without manual updates - The `keyof typeof` Pattern
 */
{
  const classNamesMap = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-black',
    success: 'bg-green-500 text-white',
  };

  // type ButtonProps = {
  //   /**
  //    * This isn't ideal - we have to manually sync
  //    * the type of variant with the object above.
  //    */
  //   variant: "primary" | "secondary" | "success";
  // };

  type ButtonProps = {
    variant: keyof typeof classNamesMap;
  };

  const Button = (props: ButtonProps) => {
    return <button className={classNamesMap[props.variant]}>Click me</button>;
  };

  const Parent = () => {
    return (
      <>
        <Button variant="primary"></Button>
        <Button variant="secondary"></Button>
        <Button variant="success"></Button>

        {/* @ts-expect-error */}
        <Button variant="something"></Button>
        {/* @ts-expect-error */}
        <Button></Button>
      </>
    );
  };
}

/**
 * Solving partial autocompletion
 */
{
  const presetSizes = {
    xs: '0.5rem',
    sm: '1rem',
  };

  type Size = keyof typeof presetSizes;

  /**
   * We want to allow users to pass in either a string, or
   * a Size. But there's an issue (see below).
   *
   * Autocomplete for sm and xs are no longer working!
   * We want to have autocomplete for the 'size' while still being
   * able to pass any value.
   */
  // type LooseSize = Size | string;

  type LooseSize = Size | (string & {}); // Similar example from React types: AriaRole

  const Icon = (props: { size: LooseSize }) => {
    return (
      <div
        style={{
          width:
            props.size in presetSizes
              ? presetSizes[
                  /**
                   * The 'as' is necessary here because TS can't seem to narrow
                   * props.size to Size properly
                   */
                  props.size as Size
                ]
              : props.size,
        }}
      />
    );
  };

  <>
    <Icon size="sm"></Icon>
    <Icon size="xs"></Icon>
    <Icon size="10px"></Icon>
  </>;
}

/**
 * Extracting keys and values from a type
 */
{
  const BACKEND_TO_FRONTEND_STATUS_MAP = {
    0: 'pending',
    1: 'success',
    2: 'error',
  } as const;

  type BackendStatusMap = typeof BACKEND_TO_FRONTEND_STATUS_MAP;

  type BackendStatus = keyof BackendStatusMap;
  type FrontendStatus = BackendStatusMap[BackendStatus];

  type Tests = [
    Expect<Equal<BackendStatus, 0 | 1 | 2>>,
    Expect<Equal<FrontendStatus, 'pending' | 'success' | 'error'>>,
  ];
}

/**
 * Comparing `as const`, `as`, and `satisfies`
 */
{
  // // Assigning the type directly here will override the type itself
  // const buttonProps: React.ComponentProps<"button"> = {
  //   type: "button",
  //   // @ts-expect-error
  //   illegalProperty: "I AM ILLEGAL",
  // };

  const buttonProps = {
    type: 'button',
    // @ts-expect-error
    illegalProperty: 'I AM ILLEGAL',
  } satisfies React.ComponentProps<'button'>;

  <>
    <button {...buttonProps}>Click Me!</button>
  </>;

  const buttonPropType = buttonProps.type;

  type Tests = [Expect<Equal<typeof buttonPropType, 'button'>>];
}
