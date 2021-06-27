import { MergedFact, mergeFacts } from './types';

describe('mergeFacts', () => {
  it('assert all facts with the same name merge together', () => {
    const actual = mergeFacts([
      { name: 'consumption', displayValue: '1', value: 1 },
      { name: 'power', displayValue: '2', value: 2 }
    ], [
      { name: 'consumption', displayValue: '2', value: 2 },
      { name: 'power', displayValue: '2.5', value: 2.5 },
    ])

    const expected: MergedFact[] = [
      { name: 'consumption', value: '1', newValue: '2' },
      { name: 'power', value: '2', newValue: '2.5' },
    ]
    expect(actual).toEqual(expected);
  })

  it('assert corner cases', () => {
    const actual = mergeFacts([
      { name: 'consumption', displayValue: '1', value: 1 },
    ], [
      { name: 'power', displayValue: '2.5', value: 2.5 },
    ])

    const expected: MergedFact[] = [
      { name: 'consumption', value: '1', newValue: '' },
      { name: 'power', value: '', newValue: '2.5' },
    ]
    expect(actual).toEqual(expected);
  })
})
