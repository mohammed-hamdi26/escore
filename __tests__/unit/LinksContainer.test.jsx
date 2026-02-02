import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LinksContainer from "@/components/settings-links/links-container";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

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
      "Social Links": "Social Links",
      "Manage your social media links": "Manage your social media links",
      "Add New Link": "Add New Link",
      "No links found": "No links found",
      "Add your first social link to get started": "Add your first social link to get started",
      "Edit": "Edit",
      "Delete": "Delete",
      "Delete Link": "Delete Link",
      "Are you sure you want to delete this link": "Are you sure you want to delete this link?",
      "Cancel": "Cancel",
      "The Link is Deleted": "Link deleted successfully",
      "error in Delete": "Error deleting link",
      "name": "Name",
      "Link": "Link",
    };
    return translations[key] || key;
  },
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "light",
  }),
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
  deleteAppSocialLink: jest.fn().mockResolvedValue({}),
  addAppSocialLink: jest.fn().mockResolvedValue({ data: { id: "new-id", name: "New Link", url: "https://new.com", image: { light: "/new.png" } } }),
  updateAppSocialLink: jest.fn().mockResolvedValue({}),
}));

// Mock DialogLinks component
jest.mock("@/components/settings-links/DialogLinks", () => ({
  __esModule: true,
  default: ({ trigger, onSuccess }) => (
    <div data-testid="dialog-links">
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
  Link2: () => <svg data-testid="icon-link2" />,
  Plus: () => <svg data-testid="icon-plus" />,
  RefreshCw: () => <svg data-testid="icon-refresh" />,
  Edit: () => <svg data-testid="icon-edit" />,
  Trash2: () => <svg data-testid="icon-trash" />,
  ExternalLink: () => <svg data-testid="icon-external" />,
}));

describe("LinksContainer", () => {
  const mockLinks = [
    {
      id: "1",
      name: "Facebook",
      url: "https://facebook.com",
      image: { light: "/facebook-light.png", dark: "/facebook-dark.png" },
    },
    {
      id: "2",
      name: "Twitter",
      url: "https://twitter.com",
      image: { light: "https://external.com/twitter.png" },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = "https://api.example.com";
  });

  it("renders empty state when no links provided", () => {
    render(<LinksContainer links={[]} />);

    expect(screen.getByText("No links found")).toBeInTheDocument();
    expect(screen.getByText("Add your first social link to get started")).toBeInTheDocument();
  });

  it("renders empty state when links is null", () => {
    render(<LinksContainer links={null} />);

    expect(screen.getByText("No links found")).toBeInTheDocument();
  });

  it("renders link cards when links provided", () => {
    render(<LinksContainer links={mockLinks} />);

    // Card-based design shows link names
    expect(screen.getByText("Facebook")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
  });

  it("displays link names", () => {
    render(<LinksContainer links={mockLinks} />);

    expect(screen.getByText("Facebook")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
  });

  it("displays link URLs", () => {
    render(<LinksContainer links={mockLinks} />);

    expect(screen.getByText("https://facebook.com")).toBeInTheDocument();
    expect(screen.getByText("https://twitter.com")).toBeInTheDocument();
  });

  it("renders page title", () => {
    render(<LinksContainer links={mockLinks} />);

    expect(screen.getByText("Social Links")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(<LinksContainer links={mockLinks} />);

    expect(screen.getByText("Manage your social media links")).toBeInTheDocument();
  });

  it("renders Add New Link button", () => {
    render(<LinksContainer links={mockLinks} />);

    expect(screen.getByText("Add New Link")).toBeInTheDocument();
  });

  it("renders edit buttons for each link", () => {
    render(<LinksContainer links={mockLinks} />);

    const editButtons = screen.getAllByText("Edit");
    expect(editButtons).toHaveLength(2);
  });

  it("renders images for links", () => {
    render(<LinksContainer links={mockLinks} />);

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  it("handles external image URLs correctly", () => {
    render(<LinksContainer links={mockLinks} />);

    const images = screen.getAllByRole("img");
    // Twitter has external URL, should be used as-is
    const twitterImage = images.find(img => img.src.includes("twitter"));
    expect(twitterImage.src).toBe("https://external.com/twitter.png");
  });

  it("prepends base URL to relative image paths", () => {
    render(<LinksContainer links={mockLinks} />);

    const images = screen.getAllByRole("img");
    // Facebook has relative URL, should have base URL prepended
    const facebookImage = images.find(img => img.src.includes("facebook"));
    expect(facebookImage.src).toBe("https://api.example.com/facebook-light.png");
  });
});
