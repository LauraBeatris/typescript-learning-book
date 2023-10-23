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
