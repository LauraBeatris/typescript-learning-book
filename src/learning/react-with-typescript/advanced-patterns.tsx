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
