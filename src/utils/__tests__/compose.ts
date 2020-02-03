import { compose } from '../compose';

[
  { f: (a: string) => a.length, out: 6 },
  {
    f: (a: number) => Array<string>(a).fill('foo'),
    out: ['foo', 'foo', 'foo', 'foo', 'foo', 'foo'],
  },
  {
    f: (a: string[]) => a.join(','),
    out: 'foo,foo,foo,foo,foo,foo',
  },
  {
    f: (a: string) => a.length,
    out: 23,
  },
  {
    f: (a: number) => a % 3 === a % 7,
    out: true,
  },
  {
    f: (a: boolean) => (a ? 'prime' : 'non-prime'),
    out: 'prime',
  },
  {
    f: (a: string) => `optimus ${a}`,
    out: 'optimus prime',
  },
  {
    f: (a: string) => (a.includes('optimus') ? 'autobot' : 'decepticon'),
    out: 'autobot',
  },
].forEach(({ out }, i, arr) => {
  it(`composes ${i + 1} function${i === 0 ? '' : 's'}`, () => {
    const compost = compose.apply(null, arr
      .map(({ f }) => f)
      .slice(0, i + 1) as any);

    const result = compost('foobar');

    expect(result).toEqual(out);
  });
});
