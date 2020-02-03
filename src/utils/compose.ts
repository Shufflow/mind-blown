// tslint:disable: only-arrow-functions
export function compose<A, B>(f: (arg: A) => B): (arg: A) => B;

export function compose<A, B, C>(
  f: (arg: A) => B,
  g: (arg: B) => C,
): (arg: A) => C;

export function compose<A, B, C, D>(
  f: (arg: A) => B,
  g: (arg: B) => C,
  h: (arg: C) => D,
): (arg: A) => D;

export function compose<A, B, C, D, E>(
  f: (arg: A) => B,
  g: (arg: B) => C,
  h: (arg: C) => D,
  i: (arg: D) => E,
): (arg: A) => E;

export function compose<A, B, C, D, E, F>(
  f: (arg: A) => B,
  g: (arg: B) => C,
  h: (arg: C) => D,
  i: (arg: D) => E,
  j: (arg: E) => F,
): (arg: A) => F;

export function compose<A, B, C, D, E, F, G>(
  f: (arg: A) => B,
  g: (arg: B) => C,
  h: (arg: C) => D,
  i: (arg: D) => E,
  j: (arg: E) => F,
  k: (arg: F) => G,
): (arg: A) => G;

export function compose<A, B, C, D, E, F, G, H>(
  f: (arg: A) => B,
  g: (arg: B) => C,
  h: (arg: C) => D,
  i: (arg: D) => E,
  j: (arg: E) => F,
  k: (arg: F) => G,
  l: (arg: G) => H,
): (arg: A) => H;

export function compose() {
  const args = Array.from(arguments);
  return (arg: any) => args.reduce((a, f) => f(a), arg);
}
