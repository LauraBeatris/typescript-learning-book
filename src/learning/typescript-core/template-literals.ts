import { S } from 'ts-toolbelt';
import { Equal, Expect } from '../../test-utils';

/**
 * Only allow specified string patterns
 */
{
  type Route = `/${string}`;
  const goToRoute = (route: Route) => {};

  goToRoute('/users');
  goToRoute('/');
  goToRoute('/admin/users');

  // @ts-expect-error
  goToRoute('users/1');
  // @ts-expect-error
  goToRoute('http://facebook.com');
}

/**
 * Extract union strings matching a pattern
 */
{
  type Routes = '/users' | '/users/:id' | '/posts' | '/posts/:id';
  type DynamicRoutes = Extract<Routes, `${string}:${string}`>;

  type Tests = Expect<Equal<DynamicRoutes, '/users/:id' | '/posts/:id'>>;
}

/**
 * Create a union of strings with all possible permutations of two unions
 */
{
  type BreadType = 'rye' | 'brown' | 'white';
  type Filling = 'cheese' | 'ham' | 'salami';
  type Sandwich = `${BreadType} sandwich with ${Filling}`;

  type Tests = Expect<
    Equal<
      Sandwich,
      | 'rye sandwich with cheese'
      | 'rye sandwich with ham'
      | 'rye sandwich with salami'
      | 'brown sandwich with cheese'
      | 'brown sandwich with ham'
      | 'brown sandwich with salami'
      | 'white sandwich with cheese'
      | 'white sandwich with ham'
      | 'white sandwich with salami'
    >
  >;
}

/**
 * Splitting a string into a tuple
 */
{
  type Path = 'Users/John/Documents/notes.txt';
  type SplitPath = S.Split<Path, '/'>;

  type Tests = Expect<
    Equal<SplitPath, ['Users', 'John', 'Documents', 'notes.txt']>
  >;
}

/**
 * Create an object whose keys are derived from a union
 */
{
  type TemplateLiteralKey = `${'user' | 'post' | 'comment'}${'Id' | 'Name'}`;
  type ObjectOfKeys = Record<TemplateLiteralKey, string>;

  type Test = Expect<
    Equal<
      ObjectOfKeys,
      {
        userId: string;
        userName: string;
        postId: string;
        postName: string;
        commentId: string;
        commentName: string;
      }
    >
  >;
}

/**
 * Transform string literals to uppercase
 */
{
  type Event = `log_in` | 'log_out' | 'sign_up';
  type EventsObjectWithUppercase = Record<Uppercase<Event>, string>;

  type Test = Expect<
    Equal<
      EventsObjectWithUppercase,
      {
        LOG_IN: string;
        LOG_OUT: string;
        SIGN_UP: string;
      }
    >
  >;
}
