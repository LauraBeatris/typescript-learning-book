/**
 * Exploring the React namespace
 */
{
  /**
   * Questions to answer 👇
   */

  // 1. What is the React namespace?
  type Example = React.ReactNode;

  // 2. How come React can be used BOTH as a value and a type?
  const element = React.createElement('div');
}

/**
 * Understanding React's JSX types: JSX.Element, React.ReactElement, and React.ReactNode
 */
{
  /**
   * 1. What's the difference between JSX.Element,
   * React.ReactNode and React.ReactElement?
   */
  type ClickMe = React.ReactElement;
  type ClickMeToo = JSX.Element;
  type ClickMeThree = React.ReactNode;

  /**
   * 2. What is the return type of this Component?
   */
  const Component = () => {
    return <div>Hello world</div>;
  };

  /**
   * 3. Fun fact - this might break on your IDE! In
   * TypeScript 5.0, this wouldn't work. But in TypeScript
   * 5.1, it DOES work.
   *
   * If it's not working for you, try making your IDE use
   * the 'workspace' version of TypeScript.
   *
   * https://stackoverflow.com/questions/39668731/what-typescript-version-is-visual-studio-code-using-how-to-update-it
   */
  const Component2 = (): React.ReactNode => {
    return <div></div>;
  };

  <>
    <Component2 />
  </>;

  /**
   * 4a. Why does this component NOT error...
   */
  const Component3 = (): React.ReactElement => {
    return <div></div>;
  };

  <>
    <Component3 />
  </>;

  /**
   * 4b. ...but this one does?
   */
  const Component4 = (): React.ReactElement => {
    // @ts-expect-error
    return 'hello!';
  };
}

/**
 * Strongly typing children in React
 *
 * Solution: Strongly typing children in React doesn't work. However, this
 * can be achieved by composition and throwing runtime exceptions.
 */
{
  type OptionType = {
    __brand: 'OPTION_TYPE';
  } & React.ReactNode;

  const Option = () => {
    return (<option></option>) as OptionType;
  };

  const Select = (props: { children: OptionType }) => {
    return <select>{props.children}</select>;
  };

  <Select>
    {/* @ts-expect-error */}
    <Option />
  </Select>;
}

/**
 * Understanding the structure of React's JSX.IntrinsicElements
 */
{
  /**
   * 1. What is JSX.IntrinsicElements? CMD-click on .IntrinsicElements below
   * to go to its definition.
   */
  type Example = JSX.IntrinsicElements;

  /**
   * 2. What is the structure of JSX.IntrinsicElements? It appears to have the
   * HTML attributes as properties, but what are the values?
   *
   * 3. Let's have some fun. Edit the file to add a new property to
   * JSX.IntrinsicElements:
   *
   * interface IntrinsicElements {
   *   // ...
   *   myNewElement: {
   *     foo: string;
   *   }
   * }
   *
   * Notice that the error below goes away!
   *
   * 4. Now change it back, before anyone notices.
   */

  // <myNewElement foo="123" />;
}

/**
 * Understanding React's ElementType and ComponentType
 */
{
  type Types = [React.ElementType, React.ComponentType];

  /**
   * ElementType
   *
   * Derives what types of elements/custom components would be able
   * to receive those props as defined in the type argument.
   */
  type Example1 = React.ElementType<{
    autoPlay?: boolean;
  }>;
  type Example2 = React.ElementType<{
    href?: string;
  }>;

  /**
   * ComponentType
   *
   * Can be used to represent either class-based components or function components.
   *
   * Also useful when working with higher-order components when you want
   * to ensure that a specific prop type is being passed to a component.
   */
  const FuncComponent = (props: { prop1: string }) => {
    return null;
  };

  class ClassComponent extends React.Component<{
    prop1: string;
  }> {
    render(): React.ReactNode {
      this.props.prop1;
      return null;
    }
  }

  const Tests1: Array<React.ComponentType<{ prop1: string }>> = [
    FuncComponent,
    ClassComponent,
  ];
}
