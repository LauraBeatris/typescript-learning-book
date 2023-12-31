<p align="center">
  <img alt="TypeScript Logo" width="150" src="./.github/images/ts-logo.png">
  <h1 align="center">TypeScript Learning Book</h1>
</p>

Throughout my TypeScript journey, modules will be added with usage examples according to each topic on this repository.

Here you can refer to the modules structured by learning area, that can be used as examples for your learning journey as well.

All of the exercises and content here were consumed through the [Total TypeScript course](https://github.com/total-typescript)

### References

#### Transformations

- [Inference Basics](./src/learning/transformations/inference-basics.ts): Utilities and operators to define types based on the compiler inference.
- [Template Literals](./src/learning/transformations/template-literals.ts): From TypeScript 4.1, Template Literals help to create object types, split strings into tuples and other useful transformations.
- [Type Helpers](./src/learning/transformations/type-helpers.ts): Building type helpers on top of the ones within the language, as well setting constraints that ensure the flexibility and reusability of types.
- [Unions and Indexing](./src/learning/transformations/unions-and-indexing.ts): Learn the difference between Unions and Discriminated Unions, how to access their properties with indexed access types and the usage of built-in utility types.
- [Conditional Types](./src/learning/transformations/conditional-types.ts): Integrate conditional types along type helpers, as well as learning the use cases behind the `infer` keyword.
- [Mapped Types](./src/learning/transformations/mapped-types.ts): Transform any type into and out of objects, unions, and tuples.

#### Generics

- [Generics Basics](./src/learning/generics/basics.ts): The syntax for assigning generics to functions and classes.
- [Advanced Generics](./src/learning/generics/advanced-generics.ts): Generics with conditional types, generic currying, and generics on interfaces.
- [Function Overloads](./src/learning/generics/function-overloads.ts): Compare and contrast overloads with generics.

#### Advanced Patterns

- [Branded Types](./src/learning/advanced-patterns/branded-types.ts): Branded types allow us to create new types in TypeScript by adding a type tag to an existing underlying type. This type tag, also known as the "brand," distinguishes values of the branded type from other values of the same underlying type.
- [Globals](./src/learning/advanced-patterns/globals.ts): Use cases to define types in a global scope.
- [Type Predicates and Assertion Functions](./src/learning/advanced-patterns/type-predicates-and-assertion-functions.ts): Allow to customize TypeScript's control flow, and
  improve inference when used in combination with `if` statements.
- [Classes - Builder Pattern](./src/learning/advanced-patterns/classes-builder-pattern.ts): Using classes and generics to build data structures and perform inference without type annotations from the user.
- [External Libraries](./src/learning/advanced-patterns/external-libraries.ts): Understanding the flow of generics through an external library, and where external types come from.
- [Identity Functions](./src/learning/advanced-patterns/identity-functions.ts): When and where to use identity functions for inference.

#### React with TypeScript

- [Advanced Props](./src/learning/react-with-typescript/advanced-props.tsx): Patterns to shape props to support multiple variants, share selected props between different components, use union types for conditional rendering, etc.
- [Generics with components](./src/learning/react-with-typescript/generics-with-components.tsx): TypeScript generics are a key tool in creating flexible, reusable components and hooks in React.
- [Advanced Hooks](./src/learning/react-with-typescript/advanced-hooks.tsx): Concepts like returning read-only tuples from custom hooks and implementing function overloads for built-in hooks like `useState`.
- [Types Deep Dive](./src/learning/react-with-typescript/types-deep-dive.tsx): Understanding the various members of the React namespace, and how to use them to build better prop types.
- [Advanced Patterns](./src/learning/react-with-typescript/advanced-patterns.tsx): Learn patterns like Render Props and Higher Order Components, solving the forwardRef problem, and understanding the ‘as’ prop.
- [External Libraries](./src/learning/react-with-typescript/external-libraries.tsx): Understand how to use TypeScript with external libraries, such as creating type-safe form components with `react-hook-form`, and learn how to use third-party generics with `react-select`.

#### Common Errors

[Exercises](./src/learning/common-errors.ts) from the [Solving TypeScript errors](https://www.totaltypescript.com/tutorials/solving-typescript-errors) workshop.
