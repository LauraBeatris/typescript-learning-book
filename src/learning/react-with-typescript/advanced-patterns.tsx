import { createPortal } from 'react-dom';
import { Equal, Expect } from '../../support/test-utils';

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
