import {
  DefaultValues,
  FieldValues,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  useForm,
} from 'react-hook-form';
import { Equal, Expect, Extends } from '../../support/test-utils';

/**
 * Understanding `useForm` type declarations in `react-hook-form`
 */
{
  /**
   * 1. When you provide default values to useForm, the return type of getValues
   * gets inferred as the shape of those values.
   *
   * Investigate why this is, and what TFieldValues is being used for.
   */
  const Example1 = () => {
    const form = useForm({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
    });

    return (
      <form
        onSubmit={form.handleSubmit((values) => {
          type Tests = [
            Expect<
              Equal<typeof values, { firstName: string; lastName: string }>
            >,
          ];
        })}
      >
        <input {...form.register('firstName')} />
        <input {...form.register('lastName')} />
      </form>
    );
  };

  /**
   * 2. When you don't pass a default value, the return type of getValues is
   * inferred as FieldValues.
   *
   * Investigate why this is, and what type FieldValues is.
   */

  const Example2 = () => {
    const form = useForm();

    return (
      <form
        onSubmit={form.handleSubmit((values) => {
          type Tests = [Expect<Equal<typeof values, FieldValues>>];
        })}
      >
        <input {...form.register('firstName')} />
        <input {...form.register('lastName')} />
      </form>
    );
  };

  /**
   * 3. If we don't pass default values, how do we get
   * react-hook-form to understand what type our fields are?
   */

  type FormValues = {
    firstName: string;
    lastName: string;
  };

  const Example3 = () => {
    const form = useForm<FormValues>();

    return (
      <form
        onSubmit={form.handleSubmit((values) => {
          type Tests = [Expect<Equal<typeof values, FormValues>>];
        })}
      >
        <input {...form.register('firstName')} />
        <input {...form.register('lastName')} />
        {/* @ts-expect-error */}
        <input {...form.register('middleName')} />
      </form>
    );
  };
}

/**
 * Creating a generic wrapper for `useForm`
 */
{
  const useCustomForm = <TFieldValues extends FieldValues>(
    defaultValues: DefaultValues<TFieldValues>,
  ): {
    register: UseFormRegister<TFieldValues>;
    handleSubmit: UseFormHandleSubmit<TFieldValues>;
    getValues: UseFormGetValues<TFieldValues>;
  } => {
    const form = useForm({
      defaultValues: defaultValues,
    });

    return {
      register: form.register,
      handleSubmit: form.handleSubmit,
      getValues: form.getValues,
    };
  };

  // ---- TESTS ----

  // @ts-expect-error defaultValues is required
  useCustomForm();

  useCustomForm(
    // @ts-expect-error defaultValues must be an object
    2,
  );

  const customForm = useCustomForm({
    firstName: '',
    lastName: '',
  });

  customForm.handleSubmit((values) => {
    type Tests = [
      Expect<
        // Expect that inside handleSubmit, it's inferred as
        // { firstName: string; lastName: string }
        Extends<
          {
            firstName: string;
            lastName: string;
          },
          typeof values
        >
      >,
    ];
  });

  // Expect that only the methods we want are exposed
  type Tests = [
    Expect<
      Equal<keyof typeof customForm, 'register' | 'handleSubmit' | 'getValues'>
    >,
  ];
}
