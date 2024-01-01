import _, { List } from 'lodash';
import { z } from 'zod';
import express, {
  RequestHandler,
  Response,
  Request,
  NextFunction,
} from 'express';
import { fetchUser, useAuthToken } from '../../support/helpers';
import { Equal, Expect, ExpectExtends } from '../../support/test-utils';
import {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
  useQuery,
} from 'react-query';

/**
 * Retrieving function parameters from an external library
 */
{
  type ParametersOfFetchUser = Parameters<typeof fetchUser>;

  type ReturnTypeOfFetchUserWithFullName = Awaited<
    ReturnType<typeof fetchUser>
  > & {
    fullName: string;
  };

  const fetchUserWithFullName = async (
    ...args: ParametersOfFetchUser
  ): Promise<ReturnTypeOfFetchUserWithFullName> => {
    const user = await fetchUser(...args);
    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  };

  type Tests = [
    Expect<Equal<ParametersOfFetchUser, [string]>>,
    Expect<
      ExpectExtends<
        { id: string; firstName: string; lastName: string; fullName: string },
        ReturnTypeOfFetchUserWithFullName
      >
    >,
  ];
}

/**
 * Passing type arguments with Lodash
 */
{
  const groupByAge = <T extends { age: number }>(array: List<T>) => {
    const grouped = _.groupBy<T>(array, 'age');

    return grouped;
  };

  const result = groupByAge([
    {
      name: 'John',
      age: 20,
    },
    {
      name: 'Jane',
      age: 20,
    },
    {
      name: 'Mary',
      age: 30,
    },
  ]);

  groupByAge([
    {
      // @ts-expect-error
      name: 'John',
    },
    {
      // @ts-expect-error
      name: 'Bill',
    },
  ]);

  type Tests = [
    Expect<Equal<typeof result, _.Dictionary<{ name: string; age: number }[]>>>,
  ];
}

/**
 * Making an Express Request function generic
 */
{
  const app = express();

  const makeTypeSafeGet =
    <TQuery extends Request['query']>(
      parser: (queryParams: Request['query']) => TQuery,
      handler: RequestHandler<any, any, any, TQuery>,
    ) =>
    (
      req: Request<any, any, any, TQuery>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        parser(req.query);
      } catch (e) {
        res.status(400).send('Invalid query: ' + (e as Error).message);
        return;
      }

      return handler(req, res, next);
    };

  const getUser = makeTypeSafeGet<{ id: string }>(
    (query) => {
      if (typeof query.id !== 'string') {
        throw new Error('You must pass an id');
      }

      return {
        id: query.id,
      };
    },
    (req, res) => {
      // req.query should be EXACTLY the type returned from
      // the parser above
      type tests = [Expect<Equal<typeof req.query, { id: string }>>];

      res.json({
        id: req.query.id,
        name: 'Matt',
      });
    },
  );

  app.get('/user', getUser);
}

/**
 * Create a runtime and type safe function with generics and Zod
 */
{
  const addTwoNumbersArg = z.object({
    a: z.number(),
    b: z.number(),
  });

  const makeZodSafeFunction = <TArg, TResult>(
    // z.ZodType has also two alias: z.Schema or z.ZodSchema
    schema: z.ZodType<TArg>,
    func: (arg: TArg) => TResult,
  ) => {
    return (arg: TArg) => {
      const result = schema.parse(arg);
      return func(result);
    };
  };

  const addTwoNumbers = makeZodSafeFunction(
    addTwoNumbersArg,
    (args) => args.a + args.b,
  );

  // Should error on the type level AND the runtime if you pass incorrect params
  addTwoNumbers(
    // @ts-expect-error
    { a: 1, badParam: 3 },
  );
}

/**
 * Targeting overloads with `useQuery`
 */
{
  interface User {
    fullName: string;
    job: string;
  }

  const getUser = async (): Promise<User> => {
    return Promise.resolve({
      fullName: 'Matt Pocock',
      job: 'Developer',
    });
  };

  /**
   * 1. How are the first three overloads different to the others? Put differently,
   * what's the thing that's similar about the first three that's different to
   * the other six?
   */

  useQuery;
  // ^ CMD+click on this to see the overloads

  /**
   * 2. When you provide queryFn to useQuery, the type of query.data is inferred
   * as the return type of queryFn. Why is that?
   */
  const query1 = useQuery({
    queryFn: getUser,
  });

  // Without initialData, the type of query1.data is User | undefined
  type Test1 = Expect<Equal<typeof query1.data, User | undefined>>;

  /**
   * 3. When you provide initialData to useQuery, the type of query.data no longer
   * has undefined in it. Why is that?
   */
  const query2 = useQuery({
    queryFn: getUser,
    initialData: {
      fullName: '',
      job: '',
    },
  });
}

/**
 * Handling type arguments in a custom query hook
 */
{
  const useApi = <TQueryKey extends QueryKey, TQueryFnData>(
    queryKey: TQueryKey,
    queryFn: (
      ctx: QueryFunctionContext<TQueryKey>,
      token: string,
    ) => Promise<TQueryFnData>,
  ) => {
    const token = useAuthToken();

    return useQuery({
      queryFn: (ctx) => queryFn(ctx, token),
      queryKey,
    });
  };

  // If you pass in an array of strings to queryFn, the type of ctx.queryKey
  // should be string[]
  const query = useApi(['users'], async (ctx, token) => {
    type Tests = [
      Expect<Equal<typeof ctx.queryKey, string[]>>,
      Expect<Equal<typeof token, string>>,
    ];

    return Promise.resolve([
      {
        id: 1,
        name: 'Matt Pocock',
      },
    ]);
  });

  // The type of query.data should be { id: number; name: string }[] | undefined
  type Tests = [
    Expect<
      Equal<typeof query.data, { id: number; name: string }[] | undefined>
    >,
  ];

  // If you pass in an array of numbers in the queryKey, the type of ctx.queryKey
  // should be number[]
  useApi([1, 2], async (ctx, token) => {
    type Tests = [
      Expect<Equal<typeof ctx.queryKey, number[]>>,
      Expect<Equal<typeof token, string>>,
    ];
  });
}
