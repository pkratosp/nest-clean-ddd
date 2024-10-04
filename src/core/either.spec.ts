import { Either, left, right } from "./either";

function doSomeThing(someSuccess: boolean): Either<string, number> {
  if (someSuccess) {
    return right(10);
  } else {
    return left("error");
  }
}

test("success result", () => {
  const result = doSomeThing(true);

  expect(result.isRight()).toEqual(true);
  expect(result.isLeft()).toEqual(false);
});

test("error result", () => {
  const result = doSomeThing(false);

  expect(result.isLeft()).toEqual(true);
  expect(result.isRight()).toEqual(false);
});
