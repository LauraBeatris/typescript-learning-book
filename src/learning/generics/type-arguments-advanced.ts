import { Equal, Expect } from '../../test-utils';

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
