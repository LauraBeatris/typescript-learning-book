import { Equal, Expect } from '../../test-utils';

type T = Partial<string>;

/**
 * Generics at different levels
 */
{
  const getHomePageFeatureFlags = <HomePageFlags>(
    config: {
      rawConfig: {
        featureFlags: {
          homePage: HomePageFlags;
        };
      };
    },
    override: (flags: HomePageFlags) => HomePageFlags,
  ) => {
    return override(config.rawConfig.featureFlags.homePage);
  };

  const EXAMPLE_CONFIG = {
    apiEndpoint: 'https://api.example.com',
    apiVersion: 'v1',
    apiKey: '1234567890',
    rawConfig: {
      featureFlags: {
        homePage: {
          showBanner: true,
          showLogOut: false,
        },
        loginPage: {
          showCaptcha: true,
          showConfirmPassword: false,
        },
      },
    },
  };

  const flags = getHomePageFeatureFlags(
    EXAMPLE_CONFIG,
    (defaultFlags) => defaultFlags,
  );

  type Tests = [
    Expect<Equal<typeof flags, { showBanner: boolean; showLogOut: boolean }>>,
  ];
}

/**
 * Typed object keys
 */
{
  const typedObjectKeys1 = <T extends object>(obj: T) => {
    return Object.keys(obj) as Array<keyof T>;
  };

  const typedObjectKeys2 = <TKey extends string>(obj: Record<TKey, any>) => {
    return Object.keys(obj) as Array<TKey>;
  };

  const result1 = typedObjectKeys1({
    a: 1,
    b: 2,
  });

  const result2 = typedObjectKeys2({
    a: 1,
    b: 2,
  });

  type Tests = [Expect<Equal<typeof result1, Array<'a' | 'b'>>>];
}

/**
 * Making a generic wrapper for a function
 */
{
  const makeSafe1 =
    <TParams extends any[], TReturn>(func: (...args: TParams) => TReturn) =>
    (
      ...args: TParams
    ):
      | {
          type: 'success';
          result: TReturn;
        }
      | {
          type: 'failure';
          error: Error;
        } => {
      try {
        const result = func(...args);

        return {
          type: 'success',
          result,
        };
      } catch (e) {
        return {
          type: 'failure',
          error: e as Error,
        };
      }
    };

  const makeSafe2 =
    <TFunc extends (...args: any[]) => any>(func: TFunc) =>
    (
      ...args: Parameters<TFunc>
    ):
      | {
          type: 'success';
          result: ReturnType<TFunc>;
        }
      | {
          type: 'failure';
          error: Error;
        } => {
      try {
        const result = func(...args);

        return {
          type: 'success',
          result,
        };
      } catch (e) {
        return {
          type: 'failure',
          error: e as Error,
        };
      }
    };

  const func1 = makeSafe1(() => 1);

  const func2 = makeSafe1(() => {
    if (1 > 2) {
      return '123';
    }
    throw new Error('Oh dear');
  });

  const func3 = makeSafe1((a: number, b: string) => {
    return `${a} ${b}`;
  });

  const result1 = func1();

  const result2 = func2();

  // @ts-expect-error
  func3();

  // @ts-expect-error
  func3(1, 1);

  func3(1, '1');

  type Tests = [
    Expect<
      Equal<
        typeof result1,
        | {
            type: 'success';
            result: number;
          }
        | {
            type: 'failure';
            error: Error;
          }
      >
    >,
    Expect<
      Equal<
        typeof result2,
        | {
            type: 'success';
            result: string;
          }
        | {
            type: 'failure';
            error: Error;
          }
      >
    >,
  ];
}

/**
 * Inferring literal types from any basic type
 */
{
  const inferItemLiteral = <T extends string | number>(t: T) => {
    return {
      output: t,
    };
  };

  const result1 = inferItemLiteral('a');
  const result2 = inferItemLiteral(123);

  // @ts-expect-error
  const error1 = inferItemLiteral({
    a: 1,
  });

  // @ts-expect-error
  const error2 = inferItemLiteral([1, 2]);

  type Tests = [
    Expect<Equal<typeof result1, { output: 'a' }>>,
    Expect<Equal<typeof result2, { output: 123 }>>,
  ];
}

/**
 * Inferring the type of an array member
 *
 * Choosing the "lowest" representation and constraining it
 */
{
  const makeStatus = <TStatus extends string>(statuses: TStatus[]) => {
    return statuses;
  };

  const statuses = makeStatus(['INFO', 'DEBUG', 'ERROR', 'WARNING']);

  type Tests = [
    Expect<
      Equal<typeof statuses, Array<'INFO' | 'DEBUG' | 'ERROR' | 'WARNING'>>
    >,
  ];
}

/**
 * Generics in a class names creator
 */
{
  const createClassNamesFactory1 =
    <TVariant extends string>(classes: Record<TVariant, string>) =>
    (type: TVariant, ...otherClasses: string[]) => {
      const classList = [classes[type], ...otherClasses];
      return classList.join(' ');
    };

  const createClassNamesFactory2 =
    <TObj extends Record<string, string>>(classes: TObj) =>
    (type: keyof TObj, ...otherClasses: string[]) => {
      const classList = [classes[type], ...otherClasses] as const;
      return classList.join(' ');
    };

  const getBg = createClassNamesFactory1({
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
  });

  const result = getBg('primary');

  type Tests = [Expect<Equal<typeof result, string>>];

  // @ts-expect-error
  getBg('123123');

  // @ts-expect-error
  createClassNamesFactory1([]);

  // @ts-expect-error
  createClassNamesFactory1(123);

  createClassNamesFactory1({
    // @ts-expect-error
    a: 1,
  });
}

/**
 * Refactoring functions with unnecessary type arguments
 *
 * Fewer type arguments are easier to refactor and scale
 */
{
  const returnBothOfWhatIPassIn = <
    TParams extends {
      a: unknown;
      b: unknown;
    },
  >(
    params: TParams,
  ): [TParams['a'], TParams['b']] => {
    return [params.a, params.b];
  };

  const result = returnBothOfWhatIPassIn({
    a: 'a',
    b: 1,
  });

  type Tests = [Expect<Equal<typeof result, [string, number]>>];
}
