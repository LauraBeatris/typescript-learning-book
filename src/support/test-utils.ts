export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? true
  : false;

export type Expect<T extends true> = T;

export type ExpectExtends<VALUE, EXPECTED> = EXPECTED extends VALUE
  ? true
  : false;

export type Extends<VALUE, EXPECTED> = EXPECTED extends VALUE ? true : false;
