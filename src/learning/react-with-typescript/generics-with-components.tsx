/**
 * Implement a generic type helper
 */
{
  type Icon = 'home' | 'settings' | 'about';
  type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

  /**
   * This type is a generic helper that allows for autocomplete functionality.
   * It takes a type T and extends it to include any string, while still providing
   * autocomplete suggestions for the original type T.
   */
  type LooseAutocomplete<T> = T | (string & {});

  // // How do we refactor this to make it DRY?
  // type LooseIcon = Icon | (string & {});
  // type LooseButtonVariant = ButtonVariant | (string & {});

  type LooseIcon = LooseAutocomplete<Icon>;
  type LooseButtonVariant = LooseAutocomplete<ButtonVariant>;

  const icons: LooseIcon[] = [
    'home',
    'settings',
    'about',
    'any-other-string',
    // I should get autocomplete if I add a new item here!
  ];

  const buttonVariants: LooseButtonVariant[] = [
    'primary',
    'secondary',
    'tertiary',
    'any-other-string',
    // I should get autocomplete if I add a new item here!
  ];
}
