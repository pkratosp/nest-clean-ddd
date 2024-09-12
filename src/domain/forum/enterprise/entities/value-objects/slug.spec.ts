import { Slug } from './slug'

test('it should be able to create a new slug from text', () => {
  const slugText = Slug.createFromText('An example title')

  expect(slugText.value).toEqual('an-example-title')
})
