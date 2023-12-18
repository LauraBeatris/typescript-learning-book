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
