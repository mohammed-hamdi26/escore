import { render, screen } from "@testing-library/react";
import TeamLineupTable from "@/components/teams management/TeamLineupTable";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => {
    const translations = {
      noPlayers: "No players in this team",
      "columns.photo": "Photo",
      "columns.name": "Name",
      "columns.role": "Role",
      "columns.country": "Country",
      "columns.age": "Age",
      "columns.actions": "Actions",
    };
    return translations[key] || key;
  },
}));

// Mock navigation Link
jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe("TeamLineupTable", () => {
  const mockPlayers = [
    {
      id: "1",
      nickname: "Player1",
      firstName: "John",
      lastName: "Doe",
      role: "AWPer",
      dateOfBirth: "2000-01-15",
      photo: {
        light: "https://example.com/player1.png",
      },
      country: {
        name: "Germany",
        flag: "🇩🇪",
      },
    },
    {
      id: "2",
      nickname: "Player2",
      firstName: "Jane",
      lastName: "Smith",
      role: "Rifler",
      dateOfBirth: "1998-06-20",
      photo: {
        dark: "https://example.com/player2-dark.png",
      },
      country: {
        name: "France",
        flag: "🇫🇷",
      },
    },
  ];

  it("renders table headers correctly", () => {
    render(<TeamLineupTable players={mockPlayers} teamId="team1" />);

    expect(screen.getByText("Photo")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders player nicknames", () => {
    render(<TeamLineupTable players={mockPlayers} teamId="team1" />);

    expect(screen.getByText("Player1")).toBeInTheDocument();
    expect(screen.getByText("Player2")).toBeInTheDocument();
  });

  it("renders player full names", () => {
    render(<TeamLineupTable players={mockPlayers} teamId="team1" />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders player roles", () => {
    render(<TeamLineupTable players={mockPlayers} teamId="team1" />);

    expect(screen.getByText("AWPer")).toBeInTheDocument();
    expect(screen.getByText("Rifler")).toBeInTheDocument();
  });

  it("renders player countries with flags", () => {
    render(<TeamLineupTable players={mockPlayers} teamId="team1" />);

    expect(screen.getByText(/🇩🇪.*Germany/)).toBeInTheDocument();
    expect(screen.getByText(/🇫🇷.*France/)).toBeInTheDocument();
  });

  it("calculates and displays player ages correctly", () => {
    const currentYear = new Date().getFullYear();
    const expectedAge1 = currentYear - 2000;
    const expectedAge2 = currentYear - 1998;

    render(<TeamLineupTable players={mockPlayers} teamId="team1" />);

    // Check if ages are displayed (accounting for birthday not yet passed)
    const ageElements = screen.getAllByRole("cell");
    const ageTexts = ageElements.map((el) => el.textContent);

    // At least one of the expected ages should be present
    const hasCorrectAge =
      ageTexts.some(
        (text) =>
          text === String(expectedAge1) || text === String(expectedAge1 - 1)
      ) &&
      ageTexts.some(
        (text) =>
          text === String(expectedAge2) || text === String(expectedAge2 - 1)
      );

    expect(hasCorrectAge).toBe(true);
  });

  it("shows empty state when no players", () => {
    render(<TeamLineupTable players={[]} teamId="team1" />);

    expect(screen.getByText("No players in this team")).toBeInTheDocument();
  });

  it("shows empty state when players is undefined", () => {
    render(<TeamLineupTable players={undefined} teamId="team1" />);

    expect(screen.getByText("No players in this team")).toBeInTheDocument();
  });

  it("shows empty state when players is null", () => {
    render(<TeamLineupTable players={null} teamId="team1" />);

    expect(screen.getByText("No players in this team")).toBeInTheDocument();
  });

  it("renders player images when available", () => {
    render(<TeamLineupTable players={mockPlayers} teamId="team1" />);

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("renders edit links for each player", () => {
    render(<TeamLineupTable players={mockPlayers} teamId="team1" />);

    const editLinks = screen.getAllByRole("link");
    expect(editLinks).toHaveLength(2);

    expect(editLinks[0]).toHaveAttribute(
      "href",
      "/dashboard/player-management/edit/1"
    );
    expect(editLinks[1]).toHaveAttribute(
      "href",
      "/dashboard/player-management/edit/2"
    );
  });

  it("handles player with missing dateOfBirth", () => {
    const playerWithoutDOB = [
      {
        id: "3",
        nickname: "Player3",
        dateOfBirth: null,
      },
    ];

    render(<TeamLineupTable players={playerWithoutDOB} teamId="team1" />);

    expect(screen.getByText("Player3")).toBeInTheDocument();
    // Multiple "-" are expected (for missing role, country, and age)
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });

  it("handles player with missing country", () => {
    const playerWithoutCountry = [
      {
        id: "4",
        nickname: "Player4",
        country: null,
      },
    ];

    render(<TeamLineupTable players={playerWithoutCountry} teamId="team1" />);

    expect(screen.getByText("Player4")).toBeInTheDocument();
  });

  it("handles player with _id instead of id", () => {
    const playerWithMongoId = [
      {
        _id: "mongo123",
        nickname: "MongoPlayer",
      },
    ];

    render(<TeamLineupTable players={playerWithMongoId} teamId="team1" />);

    const editLink = screen.getByRole("link");
    expect(editLink).toHaveAttribute(
      "href",
      "/dashboard/player-management/edit/mongo123"
    );
  });

  it("handles player with missing role", () => {
    const playerWithoutRole = [
      {
        id: "5",
        nickname: "Player5",
        role: undefined,
      },
    ];

    render(<TeamLineupTable players={playerWithoutRole} teamId="team1" />);

    expect(screen.getByText("Player5")).toBeInTheDocument();
    // Should display "-" for missing role
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });
});

describe("calculateAge helper function", () => {
  // Test age calculation indirectly through component rendering
  it("calculates age correctly for birthdate in past year", () => {
    const currentYear = new Date().getFullYear();
    const player = [
      {
        id: "1",
        nickname: "TestPlayer",
        dateOfBirth: `${currentYear - 25}-06-15`,
      },
    ];

    render(<TeamLineupTable players={player} teamId="team1" />);

    const cells = screen.getAllByRole("cell");
    const ageCell = cells.find(
      (cell) => cell.textContent === "25" || cell.textContent === "24"
    );
    expect(ageCell).toBeDefined();
  });
});
