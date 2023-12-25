import { Equal, Expect } from "../../support/test-utils";

/**
 * Fixing type inference in a custom React hook
 * 
 * Solution: Using `as const` to infer a tuple return type
 */
{
  const useId = (defaultId: string) => {
    const [id, setId] = React.useState(defaultId);
  
    return [id, setId] as const;
  };
  
  const [id, setId] = useId("1");
  
  type tests = [
    Expect<Equal<typeof id, string>>,
    Expect<Equal<typeof setId, React.Dispatch<React.SetStateAction<string>>>>,
  ];
}
