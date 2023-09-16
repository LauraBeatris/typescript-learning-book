import { Equal, Expect } from '../../test-utils';

/**
 * Understanding what are descriminated unions
 *
 * Descriminated unions have common properties which are used to differentiate
 * between members of the union. In this case, `type` is the descriminador
 */
{
  type Entity =
    | {
        type: 'car';
        brand: 'mercedes';
      }
    | {
        type: 'animal';
        breed: 'golden';
      }
    | {
        type: 'food';
        isFried: false;
      };

  const getEntityValue = (entity: Entity) => {
    if (entity.type === 'car') {
      return entity.brand;
    }

    // @ts-expect-error
    return entity.breed;
  };

  /**
   * B is a union, but not a discriminated union.
   */
  type B = 'a' | 'b' | 'c';
}

/**
 * Extracting member of unions - Extract<>
 */
{
  type Event =
    | {
        type: 'click';
        event: 'MouseEvent';
      }
    | {
        type: 'focus';
        event: 'FocusEvent';
      }
    | {
        type: 'keydown';
        event: 'KeyboardEvent';
      };

  type MouseEvent = Extract<Event, { type: 'click' }>;

  type Fruit = 'apple' | 'orange' | 'strawberry';

  type Apple = Extract<Fruit, 'apple'>;

  type Tests = [
    Expect<
      Equal<
        MouseEvent,
        {
          type: 'click';
          event: 'MouseEvent';
        }
      >
    >,
    Expect<Equal<Apple, 'apple'>>,
  ];
}

/**
 * Excluding members of unions - Exclude<>
 */
{
  type Event =
    | {
        type: 'click';
        event: 'MouseEvent';
      }
    | {
        type: 'focus';
        event: 'FocusEvent';
      }
    | {
        type: 'keydown';
        event: 'KeyboardEvent';
      };

  type NonKeyboardEvent = Exclude<Event, { type: 'keydown' }>;

  type Fruit = 'apple' | 'orange' | 'strawberry';

  type NonAppleFruit = Exclude<Fruit, 'apple'>;

  type EventType = 'click' | 'focus' | 'change' | 'abort';

  type ClickAndFocusEvent = Exclude<EventType, 'change' | 'abort'>;

  type Tests = [
    Expect<Equal<NonAppleFruit, 'orange' | 'strawberry'>>,
    Expect<
      Equal<
        NonKeyboardEvent,
        | {
            type: 'click';
            event: 'MouseEvent';
          }
        | {
            type: 'focus';
            event: 'FocusEvent';
          }
      >
    >,
    Expect<Equal<ClickAndFocusEvent, 'click' | 'focus'>>,
  ];
}

/**
 * Removing all strings/numbers/boolean from a union
 */
{
  type PossibleTypes = 'admin' | 'user' | 0 | 1 | 2;

  type StringTypes = Exclude<PossibleTypes, number>;

  type Tests = [Expect<Equal<StringTypes, 'admin' | 'user'>>];
}

/**
 * Removing strings containing a substring from a union
 */
{
  type ObjectKey = 'userId' | 'postId' | 'userName' | 'postName';

  type PostKey = Exclude<ObjectKey, `${string}${'user'}${string}`>;

  type Tests = [Expect<Equal<PostKey, 'postId' | 'postName'>>];
}

/**
 * Removing strings with one of the several possible values from a union
 */
{
  type ObjectKey = 'userId' | 'postId' | 'id' | 'userName' | 'postName';

  type NonIdKey = Exclude<ObjectKey, `${string}${'id' | 'Id'}${string}`>;

  type Tests = [Expect<Equal<NonIdKey, 'userName' | 'postName'>>];
}

/**
 * Removing strings with a certain prefix/suffix from a union
 */
{
  type ObjectKey = 'userId' | 'postId' | 'id' | 'userName' | 'postName';

  type NonNameKey = Exclude<ObjectKey, `${string}Name`>;

  type Tests = [Expect<Equal<NonNameKey, 'userId' | 'postId' | 'id'>>];
}

/**
 * Extracting object properties into individual types
 */
{
  const fakeDataDefaults = {
    String: 'Default string',
    Int: 1,
    Float: 1.14,
    Boolean: true,
    ID: 'id',
  };

  type FakeDataDefaults = typeof fakeDataDefaults;

  type StringType = FakeDataDefaults['String'];
  type IntType = FakeDataDefaults['Int'];
  type FloatType = FakeDataDefaults['Float'];
  type BooleanType = FakeDataDefaults['Boolean'];
  type IDType = FakeDataDefaults['ID'];

  type Tests = [
    Expect<Equal<StringType, string>>,
    Expect<Equal<IntType, number>>,
    Expect<Equal<FloatType, number>>,
    Expect<Equal<BooleanType, boolean>>,
    Expect<Equal<IDType, string>>,
  ];
}

/**
 * Extracting the discriminator from a discriminated union
 */
{
  type Event =
    | {
        type: 'click';
        event: 'MouseEvent';
      }
    | {
        type: 'focus';
        event: 'FocusEvent';
      }
    | {
        type: 'keydown';
        event: 'KeyboardEvent';
      };

  type EventType = Event['type'];

  type Tests = [Expect<Equal<EventType, 'click' | 'focus' | 'keydown'>>];
}

/**
 * Resolving object's values as literal types
 */
{
  const programModeEnumMap = {
    GROUP: 'group',
    ANNOUNCEMENT: 'announcement',
    ONE_ON_ONE: '1on1',
    SELF_DIRECTED: 'selfDirected',
    PLANNED_ONE_ON_ONE: 'planned1on1',
    PLANNED_SELF_DIRECTED: 'plannedSelfDirected',
  } as const;

  type GroupProgram = (typeof programModeEnumMap)['GROUP'];

  type AnnouncementProgram = (typeof programModeEnumMap)['ANNOUNCEMENT'];

  type OneOnOneProgram = (typeof programModeEnumMap)['ONE_ON_ONE'];

  type SelfDirectedProgram = (typeof programModeEnumMap)['SELF_DIRECTED'];

  type PlannedOneOnOneProgram =
    (typeof programModeEnumMap)['PLANNED_ONE_ON_ONE'];

  type PlannedSelfDirectedProgram =
    (typeof programModeEnumMap)['PLANNED_SELF_DIRECTED'];

  type Tests = [
    Expect<Equal<GroupProgram, 'group'>>,
    Expect<Equal<AnnouncementProgram, 'announcement'>>,
    Expect<Equal<OneOnOneProgram, '1on1'>>,
    Expect<Equal<SelfDirectedProgram, 'selfDirected'>>,
    Expect<Equal<PlannedOneOnOneProgram, 'planned1on1'>>,
    Expect<Equal<PlannedSelfDirectedProgram, 'plannedSelfDirected'>>,
  ];
}

/**
 * Creating a union from an object's values
 */
{
  const programModeEnumMap = {
    GROUP: 'group',
    ANNOUNCEMENT: 'announcement',
    ONE_ON_ONE: '1on1',
    SELF_DIRECTED: 'selfDirected',
    PLANNED_ONE_ON_ONE: 'planned1on1',
    PLANNED_SELF_DIRECTED: 'plannedSelfDirected',
  } as const;

  type ProgramModeEnumMap = typeof programModeEnumMap;

  type IndividualProgram1 = ProgramModeEnumMap[
    | 'ONE_ON_ONE'
    | 'SELF_DIRECTED'
    | 'PLANNED_ONE_ON_ONE'
    | 'PLANNED_SELF_DIRECTED'];

  type IndividualProgram2 = Exclude<
    ProgramModeEnumMap[keyof ProgramModeEnumMap],
    'group' | 'announcement'
  >;

  type Tests = [
    Expect<
      Equal<
        IndividualProgram1,
        '1on1' | 'selfDirected' | 'planned1on1' | 'plannedSelfDirected'
      >
    >,
    Expect<
      Equal<
        IndividualProgram2,
        '1on1' | 'selfDirected' | 'planned1on1' | 'plannedSelfDirected'
      >
    >,
  ];
}

/**
 * Creating union from an array's values
 */
{
  const fruits = ['pineapple', 'watermellow', 'grape'] as const;

  type GrapeOrWatermellow = (typeof fruits)[1 | 2];

  type Fruit = (typeof fruits)[number];

  type Tests = [
    Expect<Equal<GrapeOrWatermellow, 'watermellow' | 'grape'>>,
    Expect<Equal<Fruit, 'pineapple' | 'watermellow' | 'grape'>>,
  ];
}
