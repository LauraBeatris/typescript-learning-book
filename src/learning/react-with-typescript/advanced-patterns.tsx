import { createPortal } from 'react-dom';
import { Equal, Expect } from '../../support/test-utils';
import { Router, useRouter } from '../../support/helpers';

/**
 * Strongly typing lazy loaded components with generics
 */
{
  type Props<TComponent extends React.ComponentType<any>> = {
    loader: () => Promise<{
      default: TComponent;
    }>;
  } & React.ComponentProps<TComponent>;

  function LazyLoad<TComponent extends React.ComponentType<any>>({
    loader,
    ...props
  }: Props<TComponent>) {
    const LazyComponent = React.useMemo(() => React.lazy(loader), [loader]);
    return (
      <React.Suspense fallback={'Loading...'}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  }

  <>
    <LazyLoad
      loader={() => import('../../support/fake-external-library-component')}
      id="123"
    />

    <LazyLoad
      loader={() => import('../../support/fake-external-library-component')}
      // @ts-expect-error number is not assignable to string
      id={123}
    />

    {/* @ts-expect-error id is missing! */}
    <LazyLoad
      loader={() => import('../../support/fake-external-library-component')}
    />
  </>;
}

/**
 * Render props pattern: Typing the children prop for render props
 */
{
  interface ModalChildProps {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
  }

  /**
   * First approach: Using `children` property
   */
  const Modal1 = ({
    children,
  }: {
    // children: (props: ModalChildProps) => React.ReactNode;
    children: React.FC<ModalChildProps>;
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <>
        {children({
          isOpen,
          openModal: () => setIsOpen(true),
          closeModal: () => setIsOpen(false),
        })}
        {createPortal(
          <div>
            <h1>Modal</h1>
          </div>,
          document.getElementById('modal-root')!,
        )}
      </>
    );
  };

  /**
   * Second approach: Passing a `render` property
   */
  const Modal2 = ({
    renderButtons,
  }: {
    renderButtons: React.FC<ModalChildProps>;
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <>
        {renderButtons({
          isOpen,
          openModal: () => setIsOpen(true),
          closeModal: () => setIsOpen(false),
        })}
        {createPortal(
          <div>
            <h1>Modal</h1>
          </div>,
          document.getElementById('modal-root')!,
        )}
      </>
    );
  };

  const Parent1 = () => {
    return (
      <Modal1>
        {(props) => {
          type Tests = Expect<Equal<typeof props, ModalChildProps>>;

          return (
            <>
              <button onClick={props.openModal}>Open Modal</button>
              <button onClick={props.closeModal}>Close Modal</button>
            </>
          );
        }}
      </Modal1>
    );
  };

  const Parent2 = () => {
    return (
      <Modal2
        renderButtons={(props) => {
          type test = Expect<Equal<typeof props, ModalChildProps>>;

          return (
            <>
              <button onClick={props.openModal}>Open Modal</button>
              <button onClick={props.closeModal}>Close Modal</button>
            </>
          );
        }}
      />
    );
  };
}

/**
 * Records of components with the same props pattern: Inferring shared props for multiple components
 */
{
  type InputProps = React.ComponentProps<'input'>;

  const COMPONENTS = {
    text: (props) => {
      return <input {...props} type="text" />;
    },
    number: (props) => {
      return <input {...props} type="number" />;
    },
    password: (props) => {
      return <input {...props} type="password" />;
    },
  } satisfies Record<string, React.FC<InputProps>>;

  const Input = (
    props: {
      type: keyof typeof COMPONENTS;
    } & InputProps,
  ) => {
    const Component = COMPONENTS[props.type];
    return <Component {...props} />;
  };

  <>
    <Input
      type="number"
      onChange={(e) => {
        // e should be properly typed!
        type test = Expect<
          Equal<typeof e, React.ChangeEvent<HTMLInputElement>>
        >;
      }}
    ></Input>
    <Input type="text"></Input>
    <Input type="password"></Input>

    {/* @ts-expect-error */}
    <Input type="email"></Input>
  </>;
}

/**
 * Fixing forwardRef locally
 *
 * This is really useful because it doesn't define in the global scope, which
 * is something to keep in mind when shipping in a library.
 */
{
  // First approach: Declaring a purpose to be used instead of `forwardRef`
  // function fixedForwardRef<T, P = {}>(
  //   render: (props: P, ref: React.Ref<T>) => React.ReactNode,
  // ): (props: P & React.RefAttributes<T>) => React.ReactNode {
  //   return React.forwardRef(render) as any;
  // }

  // Recommend approach: Override `forwardRef` with `as` type.
  type FixedForwardRef = <T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode,
  ) => (props: P & React.RefAttributes<T>) => React.ReactNode;

  const fixedForwardRef = React.forwardRef as FixedForwardRef;

  type Props<T> = {
    data: T[];
    renderRow: (item: T) => React.ReactNode;
  };

  const Table = <T,>(
    props: Props<T>,
    ref: React.ForwardedRef<HTMLTableElement>,
  ) => {
    return <table ref={ref} />;
  };

  const ForwardReffedTable = fixedForwardRef(Table);

  const Parent = () => {
    const tableRef = React.useRef<HTMLTableElement>(null);
    const wrongRef = React.useRef<HTMLDivElement>(null);
    return (
      <>
        <ForwardReffedTable
          ref={tableRef}
          data={['123']}
          renderRow={(row) => {
            type test = Expect<Equal<typeof row, string>>;
            return <div>123</div>;
          }}
        />
        <ForwardReffedTable
          // @ts-expect-error
          ref={wrongRef}
          data={['123']}
          renderRow={(row) => {
            return <div>123</div>;
          }}
        />
      </>
    );
  };
}

/**
 * Implementing a generic higher order component
 */
{
  const withRouter = <TProps,>(Component: React.FC<TProps>) => {
    const NewComponent = (props: Omit<TProps, 'router'>) => {
      const router = useRouter();
      return <Component {...(props as TProps)} router={router} />;
    };

    NewComponent.displayName = `withRouter(${Component.displayName})`;

    return NewComponent;
  };

  const UnwrappedComponent = (props: { router: Router; id: string }) => {
    return null;
  };

  const WrappedComponent = withRouter(UnwrappedComponent);

  <>
    {/* @ts-expect-error needs a router! */}
    <UnwrappedComponent id="123" />

    {/* Doesn't need a router passed in! */}
    <WrappedComponent id="123" />

    <WrappedComponent
      // @ts-expect-error id must be the correct property
      id={123}
    />
  </>;
}

/**
 * Using higher order components with generic components
 */
{
  const withRouter = <TProps,>(
    Component: (props: TProps) => React.ReactNode,
  ): ((props: Omit<TProps, 'router'>) => React.ReactNode) => {
    const NewComponent = (props: Omit<TProps, 'router'>) => {
      const router = useRouter();
      return <Component {...(props as TProps)} router={router} />;
    };

    NewComponent.displayName = `withRouter(${
      (Component as { displayName?: string }).displayName
    })`;

    return NewComponent;
  };

  type TableProps<T> = {
    data: T[];
    renderRow: (item: T) => React.ReactNode;
    router: Router;
  };

  const Table = <T,>(props: TableProps<T>) => {
    return <table />;
  };

  const WrappedTable = withRouter(Table);

  <>
    {/* @ts-expect-error router is required! */}
    <Table
      data={[1, 2, 3]}
      renderRow={(row) => {
        type test = Expect<Equal<typeof row, number>>;
        return <tr />;
      }}
    />

    <WrappedTable
      data={[1, 2, 3]}
      renderRow={(row) => {
        type test = Expect<Equal<typeof row, number>>;
        return <tr />;
      }}
    />

    <WrappedTable
      data={[1, 2, 3]}
      renderRow={(row) => {
        type test = Expect<Equal<typeof row, number>>;
        return <tr />;
      }}
    />
  </>;
}
