import { Equal, Expect } from '../../test-utils';

declare global {
  function myFunc(): boolean;
  var myVar: number;
}

/**
 * Adding a function to the global scope
 */
{
  globalThis.myFunc = () => true;
  globalThis.myVar = 1;

  type Tests = [
    Expect<Equal<typeof myFunc, () => boolean>>,
    Expect<Equal<typeof myVar, number>>,
  ];
}
