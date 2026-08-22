import { render, screen } from "@testing-library/react";
import UserIcon from "./userIcon";
import { SidebarProvider } from "../../hooks/useSidebar";

// Isolate this component from its real network dependency so we can
// control exactly what `profile` looks like. useSidebar is exercised for
// real via SidebarProvider below instead of being mocked.
jest.mock("../../hooks/useProfile", () => ({
  useProfile: jest.fn(),
}));

const { useProfile } = require("../../hooks/useProfile");

const renderWithSidebar = (ui) =>
  render(<SidebarProvider role="STUDENT" navItems={[]}>{ui}</SidebarProvider>);

describe("UserIcon", () => {
  it("never renders the literal string 'undefined', even when user_id is missing", () => {
    // This mirrors real seeded student accounts, which have academic_info
    // set but no user_id yet (see issue #263) — this used to render
    // "2027 | B.Tech | undefined" in the header on every page.
    useProfile.mockReturnValue({
      profile: {
        personal_info: { name: "Demo Student 1", email: "student1@iitbhilai.ac.in" },
        academic_info: { batch_year: "2027", program: "B.Tech" },
        user_id: undefined,
      },
    });

    renderWithSidebar(<UserIcon />);

    expect(screen.getByText("Demo Student 1")).toBeInTheDocument();
    expect(screen.getByText(/2027 \| B\.Tech/)).toBeInTheDocument();
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });

  it("still shows the full details line when every field is present", () => {
    useProfile.mockReturnValue({
      profile: {
        personal_info: { name: "Test President", email: "test_president_gymkhana@iitbhilai.ac.in" },
        academic_info: { batch_year: "2024", program: "B.Tech" },
        user_id: "B21CS001",
      },
    });

    renderWithSidebar(<UserIcon />);

    expect(screen.getByText("2024 | B.Tech | B21CS001")).toBeInTheDocument();
  });
});
