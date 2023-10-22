import { Equal, Expect } from '../../test-utils';

/**
 * Adding type parameters to a function
 */
{
  const createSet = <T>() => {
    return new Set<T>();
  };

  const stringSet = createSet<string>();
  const numberSet = createSet<number>();
  const unknownSet = createSet();

  type Tests = [
    Expect<Equal<typeof stringSet, Set<string>>>,
    Expect<Equal<typeof numberSet, Set<number>>>,
    Expect<Equal<typeof unknownSet, Set<unknown>>>,
  ];
}

/**
 * Passing default type arguments
 */
{
  const createSet = <T = string>() => {
    return new Set<T>();
  };

  const numberSet = createSet<number>();
  const stringSet = createSet<string>();
  const otherStringSet = createSet();

  type Tests = [
    Expect<Equal<typeof numberSet, Set<number>>>,
    Expect<Equal<typeof stringSet, Set<string>>>,
    Expect<Equal<typeof otherStringSet, Set<string>>>,
  ];
}

/**
 * Inferring types from type arguments
 */
{
  class Component<TProps> {
    private props: TProps;

    constructor(props: TProps) {
      this.props = props;
    }

    getProps = () => this.props;
  }

  const cloneComponent = <TProps>(component: Component<TProps>) => {
    return new Component(component.getProps());
  };

  const component = new Component({ a: 1, b: 2, c: 3 });

  const clonedComponent = cloneComponent(component);

  const result = clonedComponent.getProps();

  type Tests = [
    Expect<Equal<typeof result, { a: number; b: number; c: number }>>,
  ];
}

/**
 * Typing a `reduce` function
 */
{
  const array = [
    {
      name: 'John',
    },
    {
      name: 'Steve',
    },
  ];

  const obj = array.reduce<Record<string, { name: string }>>((accum, item) => {
    accum[item.name] = item;
    return accum;
  }, {});

  type Tests = [Expect<Equal<typeof obj, Record<string, { name: string }>>>];
}

/**
 * Avoiding any types with generics
 */
(async () => {
  const fetchData = async <TData>(url: string) => {
    const data: TData = await fetch(url).then((response) => response.json());
    return data;
  };

  const data = await fetchData<{ name: string }>(
    'https://swapi.dev/api/people/1',
  );

  type Tests = [Expect<Equal<typeof data, { name: string }>>];
})();
