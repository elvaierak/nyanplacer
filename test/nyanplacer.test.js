import fontify from '../src/index'

test('Replaces patterns', () => {
  expect(fontify(
    {
      alet: word => word + word,
      blet: word => word + word + word,
      'arst arst': word => `{{${word}}}`
    },
    'arst arst alet blet nyan'
  )).toEqual('{{arst arst}} aletalet bletbletblet nyan')
})
