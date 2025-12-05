import { render, screen } from "@testing-library/react";
import TeamLineupHeader from "@/components/teams management/TeamLineupHeader";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("TeamLineupHeader", () => {
  const mockTeam = {
    name: "Team Liquid",
    logo: {
      light: "https://example.com/logo-light.png",
      dark: "https://example.com/logo-dark.png",
    },
    country: {
      name: "United States",
      flag: "🇺🇸",
    },
  };

  it("renders team name correctly", () => {
    render(<TeamLineupHeader team={mockTeam} playersCount={5} />);
    expect(screen.getByText("Team Liquid")).toBeInTheDocument();
  });

  it("renders country name and flag", () => {
    render(<TeamLineupHeader team={mockTeam} playersCount={5} />);
    expect(screen.getByText("🇺🇸 United States")).toBeInTheDocument();
  });

  it("displays correct players count for multiple players", () => {
    render(<TeamLineupHeader team={mockTeam} playersCount={5} />);
    expect(screen.getByText("5 Players")).toBeInTheDocument();
  });

  it("displays singular 'Player' for one player", () => {
    render(<TeamLineupHeader team={mockTeam} playersCount={1} />);
    expect(screen.getByText("1 Player")).toBeInTheDocument();
  });

  it("displays 0 Players when playersCount is 0", () => {
    render(<TeamLineupHeader team={mockTeam} playersCount={0} />);
    expect(screen.getByText("0 Players")).toBeInTheDocument();
  });

  it("renders team logo when available", () => {
    render(<TeamLineupHeader team={mockTeam} playersCount={5} />);
    const logo = screen.getByAltText("Team Liquid");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "https://example.com/logo-light.png");
  });

  it("renders fallback icon when no logo is available", () => {
    const teamWithoutLogo = { ...mockTeam, logo: {} };
    render(<TeamLineupHeader team={teamWithoutLogo} playersCount={5} />);
    // The Users icon should be rendered (check for svg)
    const fallbackIcon = document.querySelector("svg");
    expect(fallbackIcon).toBeInTheDocument();
  });

  it("handles undefined team gracefully", () => {
    render(<TeamLineupHeader team={undefined} playersCount={0} />);
    // Should not crash and should render fallback elements
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("handles team with missing country", () => {
    const teamWithoutCountry = { ...mockTeam, country: undefined };
    render(<TeamLineupHeader team={teamWithoutCountry} playersCount={5} />);
    expect(screen.getByText("Team Liquid")).toBeInTheDocument();
  });
});
