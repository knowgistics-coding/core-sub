import { cleanup, render, screen } from "@testing-library/react";
import Absatz from ".";

afterEach(cleanup);

test("Absatz: simple value", () => {
  render(<Absatz value="<p>Simple Value</p>" />);
  const linkElement = screen.getByText(/Simple Value/i);
  expect(linkElement).toBeInTheDocument();
});
