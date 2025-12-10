import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ThemesTable from "@/app/[locale]/dashboard/settings/apperance/_components/themes-table";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => {
    const translations = {
      "Themes": "Themes",
      "Manage app color themes": "Manage app color themes",
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
      "DialogDeleteTitle": "Delete Theme",
      "DialogDeleteDescription": "Are you sure you want to delete this theme?",
      "Cancel": "Cancel",
      "Theme deleted successfully": "Theme deleted successfully",
      "Failed to delete theme": "Failed to delete theme",
    };
    return translations[key] || key;
  },
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock actions
jest.mock("@/app/[locale]/_Lib/actions", () => ({
  deleteTheme: jest.fn().mockResolvedValue({}),
}));

// Mock ThemeDialog
jest.mock("@/app/[locale]/dashboard/settings/apperance/_components/theme-dialog", () => ({
  __esModule: true,
  default: ({ trigger, formType, onSuccess, currentTheme, t }) => (
    <div data-testid={`theme-dialog-${formType}`}>
      {trigger}
    </div>
  ),
}));

// Mock AlertDialog components
jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children, open }) => open ? <div data-testid="alert-dialog">{children}</div> : null,
  AlertDialogContent: ({ children }) => <div data-testid="alert-content">{children}</div>,
  AlertDialogHeader: ({ children }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }) => <h2>{children}</h2>,
  AlertDialogDescription: ({ children }) => <p>{children}</p>,
  AlertDialogFooter: ({ children }) => <div>{children}</div>,
  AlertDialogCancel: ({ children, disabled }) => <button data-testid="alert-cancel" disabled={disabled}>{children}</button>,
  AlertDialogAction: ({ children, onClick, disabled }) => <button data-testid="alert-action" onClick={onClick} disabled={disabled}>{children}</button>,
}));

// Mock Button
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className, variant, size }) => (
    <button onClick={onClick} disabled={disabled} className={className} data-testid="button">
      {children}
    </button>
  ),
}));

// Mock Spinner
jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Palette: () => <svg data-testid="icon-palette" />,
  Plus: () => <svg data-testid="icon-plus" />,
  RefreshCw: () => <svg data-testid="icon-refresh" />,
  Edit: () => <svg data-testid="icon-edit" />,
  Trash2: () => <svg data-testid="icon-trash" />,
  Sun: () => <svg data-testid="icon-sun" />,
  Moon: () => <svg data-testid="icon-moon" />,
}));

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

  it("renders theme cards when themes provided", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    // Card-based design shows theme color codes
    expect(screen.getByText("#FF5733")).toBeInTheDocument();
    expect(screen.getByText("#33FF57")).toBeInTheDocument();
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

  it("renders subtitle", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getByText("Manage app color themes")).toBeInTheDocument();
  });

  it("renders Add new theme button", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getByText("Add new theme")).toBeInTheDocument();
  });

  it("renders edit dialog for each theme", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getAllByTestId("theme-dialog-edit")).toHaveLength(2);
  });

  it("renders edit buttons for each theme", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    const editButtons = screen.getAllByText("Edit");
    expect(editButtons).toHaveLength(2);
  });

  it("renders add dialog for adding new themes", () => {
    render(<ThemesTable initialThemes={mockThemes} />);

    expect(screen.getByTestId("theme-dialog-add")).toBeInTheDocument();
  });

  it("renders color preview boxes", () => {
    const { container } = render(<ThemesTable initialThemes={mockThemes} />);

    const colorBoxes = container.querySelectorAll('[style*="background-color"]');
    expect(colorBoxes.length).toBeGreaterThan(0);
  });
});
