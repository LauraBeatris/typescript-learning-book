/**
 * @refer https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
 */

interface Obj {
  // Method shorthand syntax
  version1(param: string): void;
  // Object property syntax
  version2: (param: string) => void;
}

interface Dog {
  barkAt(dog: Dog): void;
}

/**
 * When you use `Dog` to type a variable, you can annotate the parameter 
 * for `.barkAt` with a narrower type than the `Dog` interface expects:
 */
interface SmallDog extends Dog {
  whimper: () => void;
}
 
/**
 * Runtime error that TypeScript won't catch. 
 * Inside brian's `barkAt` function we could easily call `dog.whimper()`.
 */
const brian: Dog = {
  barkAt(smallDog: SmallDog) {
    smallDog.whimper();
  },
};

const normalDog: Dog = {
  barkAt() {},
};

/**
 * But when we pass the normal dog to `brian.barkAt`, it will fail at runtime:
 */
brian.barkAt(normalDog); 

interface Dog2 {
  barkAt: (dog: Dog) => void;
}

interface SmallDog2 extends Dog2 {
  whimper: () => void;
}

const brian2: Dog2 = {
  /**
   * Type '(dog: SmallDog2) => void' is not assignable to type '(dog: Dog) => void'.
   * Types of parameters 'dog' and 'dog' are incompatible.
   */
  barkAt(dog: SmallDog2) {},
}
