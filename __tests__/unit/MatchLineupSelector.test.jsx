import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MatchLineupSelector from "@/components/Matches Management/MatchLineupSelector";
import { fetchPlayersByTeam } from "@/app/[locale]/_Lib/actions";

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
      "Team Lineup": "Team Lineup",
      "Select All": "Select All",
      "Clear All": "Clear All",
      selected: "selected",
      "Loading players": "Loading players...",
      "No players available": "No players in this team",
      "Failed to load players": "Failed to load players",
    };
    return translations[key] || key;
  },
}));

// Mock the server action
jest.mock("@/app/[locale]/_Lib/actions", () => ({
  fetchPlayersByTeam: jest.fn(),
}));

describe("MatchLineupSelector", () => {
  const mockPlayers = [
    {
      id: "player1",
      nickname: "Player One",
      firstName: "John",
      lastName: "Doe",
      role: "IGL",
      photo: { light: "https://example.com/photo1.png" },
      country: { flag: "🇺🇸" },
    },
    {
      id: "player2",
      nickname: "Player Two",
      firstName: "Jane",
      lastName: "Smith",
      role: "AWP",
      photo: { dark: "https://example.com/photo2.png" },
      country: { flag: "🇬🇧" },
    },
    {
      id: "player3",
      nickname: "Player Three",
      firstName: null,
      lastName: null,
      role: null,
      photo: {},
      country: {},
    },
  ];

  const defaultProps = {
    teamId: "team1",
    teamName: "Test Team",
    teamLogo: "https://example.com/team-logo.png",
    selectedPlayers: [],
    onSelectionChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fetchPlayersByTeam.mockResolvedValue(mockPlayers);
  });

  it("returns null when no teamId is provided", () => {
    const { container } = render(
      <MatchLineupSelector {...defaultProps} teamId={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows loading state while fetching players", async () => {
    fetchPlayersByTeam.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockPlayers), 100))
    );

    render(<MatchLineupSelector {...defaultProps} />);

    expect(screen.getByText("Loading players...")).toBeInTheDocument();
  });

  it("fetches players when teamId is provided", async () => {
    render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      expect(fetchPlayersByTeam).toHaveBeenCalledWith("team1");
    });
  });

  it("displays team name in header", async () => {
    render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Test Team")).toBeInTheDocument();
    });
  });

  it("displays team logo when provided", async () => {
    render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      const logo = screen.getByAltText("Test Team");
      expect(logo).toBeInTheDocument();
    });
  });

  it("renders all players from the API response", async () => {
    render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Player One")).toBeInTheDocument();
      expect(screen.getByText("Player Two")).toBeInTheDocument();
      expect(screen.getByText("Player Three")).toBeInTheDocument();
    });
  });

  it("displays player roles when available", async () => {
    render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("IGL")).toBeInTheDocument();
      expect(screen.getByText("AWP")).toBeInTheDocument();
    });
  });

  it("displays player full names when available", async () => {
    render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("displays country flags when available", async () => {
    render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("🇺🇸")).toBeInTheDocument();
      expect(screen.getByText("🇬🇧")).toBeInTheDocument();
    });
  });

  it("shows selected count correctly", async () => {
    render(
      <MatchLineupSelector {...defaultProps} selectedPlayers={["player1"]} />
    );

    await waitFor(() => {
      expect(screen.getByText("1 selected")).toBeInTheDocument();
    });
  });

  it("calls onSelectionChange when a player is toggled", async () => {
    const onSelectionChange = jest.fn();
    render(
      <MatchLineupSelector
        {...defaultProps}
        onSelectionChange={onSelectionChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Player One")).toBeInTheDocument();
    });

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    expect(onSelectionChange).toHaveBeenCalledWith(["player1"]);
  });

  it("removes player from selection when already selected", async () => {
    const onSelectionChange = jest.fn();
    render(
      <MatchLineupSelector
        {...defaultProps}
        selectedPlayers={["player1"]}
        onSelectionChange={onSelectionChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Player One")).toBeInTheDocument();
    });

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    expect(onSelectionChange).toHaveBeenCalledWith([]);
  });

  it("selects all players when 'Select All' button is clicked", async () => {
    const onSelectionChange = jest.fn();
    render(
      <MatchLineupSelector
        {...defaultProps}
        onSelectionChange={onSelectionChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Player One")).toBeInTheDocument();
    });

    const selectAllButton = screen.getByText("Select All");
    fireEvent.click(selectAllButton);

    expect(onSelectionChange).toHaveBeenCalledWith([
      "player1",
      "player2",
      "player3",
    ]);
  });

  it("clears all players when 'Clear All' button is clicked", async () => {
    const onSelectionChange = jest.fn();
    render(
      <MatchLineupSelector
        {...defaultProps}
        selectedPlayers={["player1", "player2"]}
        onSelectionChange={onSelectionChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Player One")).toBeInTheDocument();
    });

    const clearAllButton = screen.getByText("Clear All");
    fireEvent.click(clearAllButton);

    expect(onSelectionChange).toHaveBeenCalledWith([]);
  });

  it("disables 'Clear All' button when no players selected", async () => {
    render(<MatchLineupSelector {...defaultProps} selectedPlayers={[]} />);

    await waitFor(() => {
      expect(screen.getByText("Player One")).toBeInTheDocument();
    });

    const clearAllButton = screen.getByText("Clear All");
    expect(clearAllButton).toBeDisabled();
  });

  it("disables 'Select All' button while loading", () => {
    fetchPlayersByTeam.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockPlayers), 1000))
    );

    render(<MatchLineupSelector {...defaultProps} />);

    const selectAllButton = screen.getByText("Select All");
    expect(selectAllButton).toBeDisabled();
  });

  it("displays error message when API fails", async () => {
    fetchPlayersByTeam.mockRejectedValue(new Error("API Error"));

    render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load players")).toBeInTheDocument();
    });
  });

  it("displays empty state when no players returned", async () => {
    fetchPlayersByTeam.mockResolvedValue([]);

    render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("No players in this team")).toBeInTheDocument();
    });
  });

  it("displays fallback icon when team logo is not provided", async () => {
    render(<MatchLineupSelector {...defaultProps} teamLogo={null} />);

    await waitFor(() => {
      expect(screen.getByText("Player One")).toBeInTheDocument();
    });

    // Should show Users icon instead of logo
    const svgIcons = document.querySelectorAll("svg");
    expect(svgIcons.length).toBeGreaterThan(0);
  });

  it("uses _id as fallback when id is not available", async () => {
    const playersWithMongoId = [
      {
        _id: "mongo-id-1",
        nickname: "Mongo Player",
        role: "Entry",
      },
    ];
    fetchPlayersByTeam.mockResolvedValue(playersWithMongoId);

    const onSelectionChange = jest.fn();
    render(
      <MatchLineupSelector
        {...defaultProps}
        onSelectionChange={onSelectionChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Mongo Player")).toBeInTheDocument();
    });

    const selectAllButton = screen.getByText("Select All");
    fireEvent.click(selectAllButton);

    expect(onSelectionChange).toHaveBeenCalledWith(["mongo-id-1"]);
  });

  it("handles players with only light photo", async () => {
    render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      const photo = screen.getByAltText("Player One");
      expect(photo).toHaveAttribute("src", "https://example.com/photo1.png");
    });
  });

  it("handles players with only dark photo", async () => {
    render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      const photo = screen.getByAltText("Player Two");
      expect(photo).toHaveAttribute("src", "https://example.com/photo2.png");
    });
  });

  it("refetches players when teamId changes", async () => {
    const { rerender } = render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      expect(fetchPlayersByTeam).toHaveBeenCalledWith("team1");
    });

    rerender(<MatchLineupSelector {...defaultProps} teamId="team2" />);

    await waitFor(() => {
      expect(fetchPlayersByTeam).toHaveBeenCalledWith("team2");
    });
  });

  it("clears players when teamId becomes null", async () => {
    const { rerender } = render(<MatchLineupSelector {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Player One")).toBeInTheDocument();
    });

    rerender(<MatchLineupSelector {...defaultProps} teamId={null} />);

    expect(screen.queryByText("Player One")).not.toBeInTheDocument();
  });
});
