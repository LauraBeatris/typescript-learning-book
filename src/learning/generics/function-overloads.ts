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
  
  type Tests = [Expect<Equal<typeof one, 1>>, Expect<Equal<typeof matt, "matt">>];
  
}
