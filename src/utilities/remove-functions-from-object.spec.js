import removeFuncs from './remove-functions-from-object'

test('removes functions from object', () => {
  const objWithFuncs = {
    fn: () => {
      return 1 + 2
    },
    value: 9
  }
  expect(removeFuncs(objWithFuncs)).toStrictEqual({ value: 9 })
})

test('removes null entries when flag set', () => {
  const objWithNull = {
    foo: null,
    bar: 'baz'
  }

  expect(removeFuncs(objWithNull, true)).toStrictEqual({ bar: 'baz' })
})

test('removes both functions and null when flag set', () => {
  const objWithNullAndFuncs = {
    foo: null,
    bar: 'baz',
    fn: () => {
      return 1 + 2
    }
  }

  expect(removeFuncs(objWithNullAndFuncs, true)).toStrictEqual({ bar: 'baz' })
})
