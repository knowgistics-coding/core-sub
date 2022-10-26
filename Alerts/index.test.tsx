import { fireEvent, render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { Alerts, useAlerts } from ".";

const AlertContainer = (props: { children: ReactNode }) => {
  return <Alerts>{props.children}</Alerts>;
};

const AlertTest = () => {
  const { addAlert } = useAlerts();

  const handleAlert = () => {
    addAlert({ label: "Test Alert" });
  };

  return (
    <button aria-label="alert" onClick={handleAlert}>
      alert
    </button>
  );
};

test("Alerts: Push Alert", () => {
  render(
    <AlertContainer>
      <AlertTest />
    </AlertContainer>
  );

  const alertButton = screen.getByRole("button", { name: "alert" });
  fireEvent.click(alertButton);

  const snackbar = screen.getByText(/Test Alert/i);
  expect(snackbar).toBeInTheDocument();
});
