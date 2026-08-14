import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

jest.mock("axios", () => {
  const instance = {
    get: jest.fn(() => Promise.resolve({ data: null })),
    post: jest.fn(() => Promise.resolve({ data: null })),
    put: jest.fn(() => Promise.resolve({ data: null })),
    patch: jest.fn(() => Promise.resolve({ data: null })),
    delete: jest.fn(() => Promise.resolve({ data: null })),
  };
  return { create: jest.fn(() => instance) };
});

test("renders the app and lands on the login page for unauthenticated users", async () => {
  render(<App />);

  // Wait for the auth check (fetchCredentials -> null) to complete.
  await waitFor(() => {
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });
});