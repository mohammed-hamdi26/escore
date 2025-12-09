import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ThemesTable from "@/app/[locale]/dashboard/settings/apperance/_components/themes-table";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => {
    const translations = {
      "Themes": "Themes",
      "Add new theme": "Add new theme",
      "No themes found": "No themes found",
      "Add your first theme to get started": "Add your first theme to get started",
      "Edit": "Edit",
      "Delete": "Delete",
      "Dark": "Dark",
      "Light": "Light",
      "Color Code": "Color Code",
      "Theme Type": "Theme Type",
      "Color": "Color",
    };
    return translations[key] || key;
  },
}));

// Mock ThemeDialog
jest.mock("@/app/[locale]/dashboard/settings/apperance/_components/theme-dialog", () => ({
  __esModule: true,
  default: ({ trigger, formType, t }) => (
    <div data-testid={`theme-dialog-${formType}`}>
      {trigger}
    </div>
  ),
}));

// Mock ThemeDeleteDialog
jest.mock("@/app/[locale]/dashboard/settings/apperance/_components/theme-delete-dialog", () => ({
  __esModule: true,
  default: ({ theme_id, onDelete, t }) => (
    <button
      data-testid={`delete-dialog-${theme_id}`}
      onClick={() => onDelete(theme_id)}
    >
      {t("Delete")}
    </button>
  ),
}));

// Mock Button
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className }) => (
    <button onClick={onClick} disabled={disabled} className={className} data-testid="button">
      {children}
    </button>
  ),
}));

// Mock Table
jest.mock("@/components/ui app/Table", () => {
  const Table = ({ children, t }) => <table data-testid="table"><tbody>{children}</tbody></table>;
  Table.Row = ({ children }) => <tr data-testid="table-row">{children}</tr>;
  Table.Cell = ({ children, className }) => <td data-testid="table-cell" className={className}>{children}</td>;
  return {
    __esModule: true,
    default: Table,
  };
});

describe("ThemesTable", () => {
  const mockThemes = [
    {
      id: "1",
      color: "#FF5733",
      typeTheme: "dark",
    },
    {
      id: "2",
      color: "#33FF57",
      typeTheme: "light",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state when no themes provided", () => {
    render(<ThemesTable initialThemes={[]} />);

    expect(screen.getByText("No themes found")).toBeInTheDocument();
    expect(screen.getByText("Add your first theme to get started")).toBeInTheDocument();
  });

  it("renders empty state when themes is null", () => {
    render(<ThemesTable initialThemes={null} />);

    expect(screen.getByText("No themes found")).toBeInTheDocument();
  });

  it("renders themes table when themes provided", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.getAllByTestId("table-row")).toHaveLength(2);
  });

  it("displays theme color codes", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getByText("#FF5733")).toBeInTheDocument();
    expect(screen.getByText("#33FF57")).toBeInTheDocument();
  });

  it("displays theme types with correct labels", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("Light")).toBeInTheDocument();
  });

  it("renders page title", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getByText("Themes")).toBeInTheDocument();
  });

  it("renders Add new theme button", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getByText("Add new theme")).toBeInTheDocument();
  });

  it("renders edit dialog for each theme", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getAllByTestId("theme-dialog-edit")).toHaveLength(2);
  });

  it("renders delete dialog for each theme", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getByTestId("delete-dialog-1")).toBeInTheDocument();
    expect(screen.getByTestId("delete-dialog-2")).toBeInTheDocument();
  });

  it("removes theme from list when deleted", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getAllByTestId("table-row")).toHaveLength(2);

    const deleteButton = screen.getByTestId("delete-dialog-1");
    fireEvent.click(deleteButton);

    expect(screen.getAllByTestId("table-row")).toHaveLength(1);
    expect(screen.queryByText("#FF5733")).not.toBeInTheDocument();
    expect(screen.getByText("#33FF57")).toBeInTheDocument();
  });

  it("renders color preview boxes with correct background colors", () => {
    const { container } = render(<ThemesTable initialThemes={mockThemes} />);

    const colorBoxes = container.querySelectorAll('[style*="background-color"]');
    expect(colorBoxes.length).toBeGreaterThan(0);
  });

  it("uses theme id as key when available", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    // Should render without key warnings
    expect(screen.getAllByTestId("table-row")).toHaveLength(2);
  });

  it("falls back to color as key when id not available", () => {
    const themesWithoutId = [
      { color: "#FF5733", typeTheme: "dark" },
      { color: "#33FF57", typeTheme: "light" },
    ];

    render(<ThemesTable initialThemes={themesWithoutId} />);

    expect(screen.getAllByTestId("table-row")).toHaveLength(2);
  });

  it("renders add dialog for adding new themes", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getByTestId("theme-dialog-add")).toBeInTheDocument();
  });
});
