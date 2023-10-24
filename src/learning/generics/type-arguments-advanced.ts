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
