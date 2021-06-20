import { MergedFact, mergeFacts } from './types';

describe('mergeFacts', () => {
  it('assert all facts with the same name merge together', () => {
    const actual = mergeFacts([
      { name: 'fact1', value: '1' },
      { name: 'fact2', value: '2' }
    ], [
      { name: 'fact1', value: '2' },
      { name: 'fact2', value: '2.5' },
    ])

    const expected: MergedFact[] = [
      { name: 'fact1', value: '1', newValue: '2' },
      { name: 'fact2', value: '2', newValue: '2.5' },
    ]
    expect(actual).toEqual(expected);
  })

  it('assert corner cases', () => {
    const actual = mergeFacts([
      { name: 'fact1', value: '1' },
    ], [
      { name: 'fact2', value: '2.5' },
    ])

    const expected: MergedFact[] = [
      { name: 'fact1', value: '1', newValue: '' },
      { name: 'fact2', value: '', newValue: '2.5' },
    ]
    expect(actual).toEqual(expected);
  })
})
