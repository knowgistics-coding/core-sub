import { cleanup, render } from "@testing-library/react";
import ActionIcon from ".";
import { PickIconName } from "../PickIcon";

afterEach(cleanup)

test("ActionIcon: icon Align-Center", () => {
  const { container } = render(<ActionIcon icon={"align-center"} />);
  expect(container.querySelectorAll("svg").length).toEqual(1)
});

describe("ActionIcon: unknown icon", () => {
  let consoleOutput:Error|null = null
  const mockedWarn = (output:Error) => {
    consoleOutput = output
  }
  beforeEach(() => (console.error = mockedWarn))

  test("ActionIcon: unknown icon", () => {
    render(<ActionIcon icon={"unknown" as PickIconName} />);
    expect(consoleOutput).toEqual("Could not find icon")
  });
})

