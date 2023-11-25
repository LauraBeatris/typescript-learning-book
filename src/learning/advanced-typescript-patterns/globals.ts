import { Equal, Expect } from '../../test-utils';

declare global {
  function myFunc(): boolean;
  var myVar: number;

  interface Window {
    makeGreeting(): string;
  }
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

/**
 * Use declaration merging to add functionally to the global window
 *
 * “declaration merging” means that the compiler merges two separate declarations
 * declared with the same name into a single definition.
 * @ref https://www.typescriptlang.org/docs/handbook/declaration-merging.html#handbook-content
 */
{
  window.makeGreeting = () => 'Hello, world!';

  type Tests = [Expect<Equal<typeof window.makeGreeting, () => string>>];
}