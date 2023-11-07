import { Equal, Expect } from "../../test-utils";

/**
 * Understanding function overloads
 * 
 * Implementation signature vs function signature
 */
{
  function returnWhatIPassIn(t: 1): 1;
  function returnWhatIPassIn(t: "matt"): "matt";
  function returnWhatIPassIn(t: unknown): unknown {
    return t;
  }

  const one = returnWhatIPassIn(1);
  const matt = returnWhatIPassIn("matt");

  type Tests = [
    Expect<Equal<typeof one, 1>>, 
    Expect<Equal<typeof matt, "matt">>
  ];
}


/**
 * Match return types with function overloads
 * 
 * Tips: When doing a implementation signature, make sure to define a return type
 * that matches the function signatures ones. This is due for function overloads
 * not being that type safety.
 */
{
  function youSayGoodbyeISayHello(greeting: "hello"): "goodbye";
  function youSayGoodbyeISayHello(greeting: "goodbye"): "hello";
  function youSayGoodbyeISayHello (greeting: "hello" | "goodbye"): "goodbye" | "hello" {
    return greeting === "goodbye" ? "hello" : "goodbye";
  };

  const result1 = youSayGoodbyeISayHello("hello");
  const result2 = youSayGoodbyeISayHello("goodbye");

  type Tests = [
    Expect<Equal<typeof result1, "goodbye">>, 
    Expect<Equal<typeof result2, "hello">>
  ];
}
