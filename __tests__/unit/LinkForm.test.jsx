import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LinkForm from "@/components/settings-links/LinkForm";

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
  addAppSocialLink: jest.fn().mockResolvedValue({
    data: {
      id: "new-id",
      name: "New Link",
      url: "https://new.com",
      image: { light: "/new.png", dark: "/new-dark.png" }
    }
  }),
  updateAppSocialLink: jest.fn().mockResolvedValue({}),
}));

// Mock InputApp
jest.mock("@/components/ui app/InputApp", () => ({
  __esModule: true,
  default: ({ label, name, error, ...props }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} data-testid={`input-${name}`} {...props} />
      {error && <span data-testid={`error-${name}`}>{error}</span>}
    </div>
  ),
}));

// Mock FileInput
jest.mock("@/components/ui app/FileInput", () => ({
  __esModule: true,
  default: ({ label, name, error, ...props }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} data-testid={`file-${name}`} {...props} />
      {error && <span data-testid={`error-${name}`}>{error}</span>}
    </div>
  ),
}));

// Mock Button
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, type, className }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
      data-testid="submit-button"
    >
      {children}
    </button>
  ),
}));

// Mock Spinner
jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe("LinkForm", () => {
  const mockT = (key) => {
    const translations = {
      "Name": "Name",
      "URL": "URL",
      "Light Image URL": "Light Image URL",
      "Dark Image URL": "Dark Image URL",
      "Link Name": "Link Name",
      "Name is required": "Name is required",
      "URL is required": "URL is required",
      "Invalid URL": "Invalid URL",
      "Light image URL is required": "Light image URL is required",
      "Add Link": "Add Link",
      "Update Link": "Update Link",
      "Link added successfully": "Link added successfully",
      "Link updated successfully": "Link updated successfully",
      "An error occurred": "An error occurred",
    };
    return translations[key] || key;
  };

  const mockSetOpen = jest.fn();
  const mockSetLinks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields for adding new link", () => {
    render(
      <LinkForm
        t={mockT}
        setOpen={mockSetOpen}
        setLinks={mockSetLinks}
      />
    );

    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-url")).toBeInTheDocument();
    expect(screen.getByTestId("file-lightImage")).toBeInTheDocument();
    expect(screen.getByTestId("file-darkImage")).toBeInTheDocument();
  });

  it("renders Add Link button when no link provided", () => {
    render(
      <LinkForm
        t={mockT}
        setOpen={mockSetOpen}
        setLinks={mockSetLinks}
      />
    );

    expect(screen.getByText("Add Link")).toBeInTheDocument();
  });

  it("renders Update Link button when link provided", () => {
    const existingLink = {
      id: "1",
      name: "Existing",
      url: "https://existing.com",
      image: { light: "/light.png", dark: "/dark.png" },
    };

    render(
      <LinkForm
        t={mockT}
        setOpen={mockSetOpen}
        link={existingLink}
        setLinks={mockSetLinks}
      />
    );

    expect(screen.getByText("Update Link")).toBeInTheDocument();
  });

  it("pre-fills form when editing existing link", () => {
    const existingLink = {
      id: "1",
      name: "Facebook",
      url: "https://facebook.com",
      image: { light: "/fb-light.png", dark: "/fb-dark.png" },
    };

    render(
      <LinkForm
        t={mockT}
        setOpen={mockSetOpen}
        link={existingLink}
        setLinks={mockSetLinks}
      />
    );

    expect(screen.getByTestId("input-name")).toHaveValue("Facebook");
    expect(screen.getByTestId("input-url")).toHaveValue("https://facebook.com");
  });

  it("handles null image gracefully", () => {
    const linkWithNullImage = {
      id: "1",
      name: "Test",
      url: "https://test.com",
      image: null,
    };

    render(
      <LinkForm
        t={mockT}
        setOpen={mockSetOpen}
        link={linkWithNullImage}
        setLinks={mockSetLinks}
      />
    );

    expect(screen.getByTestId("input-name")).toHaveValue("Test");
  });

  it("handles undefined image dark gracefully", () => {
    const linkWithPartialImage = {
      id: "1",
      name: "Test",
      url: "https://test.com",
      image: { light: "/light.png" },
    };

    render(
      <LinkForm
        t={mockT}
        setOpen={mockSetOpen}
        link={linkWithPartialImage}
        setLinks={mockSetLinks}
      />
    );

    expect(screen.getByTestId("input-name")).toHaveValue("Test");
  });

  it("submits form and calls addAppSocialLink for new link", async () => {
    const { addAppSocialLink } = require("@/app/[locale]/_Lib/actions");
    const toast = require("react-hot-toast").default;

    render(
      <LinkForm
        t={mockT}
        setOpen={mockSetOpen}
        setLinks={mockSetLinks}
      />
    );

    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "New Link" } });
    fireEvent.change(screen.getByTestId("input-url"), { target: { value: "https://newlink.com" } });
    fireEvent.change(screen.getByTestId("file-lightImage"), { target: { value: "/light.png" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addAppSocialLink).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Link added successfully");
    });

    await waitFor(() => {
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  it("submits form and calls updateAppSocialLink for existing link", async () => {
    const { updateAppSocialLink } = require("@/app/[locale]/_Lib/actions");
    const toast = require("react-hot-toast").default;

    const existingLink = {
      id: "1",
      name: "Existing",
      url: "https://existing.com",
      image: { light: "/light.png" },
    };

    render(
      <LinkForm
        t={mockT}
        setOpen={mockSetOpen}
        link={existingLink}
        setLinks={mockSetLinks}
      />
    );

    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Updated Link" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateAppSocialLink).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Link updated successfully");
    });
  });

  it("handles submission error", async () => {
    const { addAppSocialLink } = require("@/app/[locale]/_Lib/actions");
    const toast = require("react-hot-toast").default;

    addAppSocialLink.mockRejectedValueOnce(new Error("Server error"));

    render(
      <LinkForm
        t={mockT}
        setOpen={mockSetOpen}
        setLinks={mockSetLinks}
      />
    );

    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "New Link" } });
    fireEvent.change(screen.getByTestId("input-url"), { target: { value: "https://newlink.com" } });
    fireEvent.change(screen.getByTestId("file-lightImage"), { target: { value: "/light.png" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });
  });

  it("updates links state after successful add", async () => {
    const { addAppSocialLink } = require("@/app/[locale]/_Lib/actions");

    render(
      <LinkForm
        t={mockT}
        setOpen={mockSetOpen}
        setLinks={mockSetLinks}
      />
    );

    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "New Link" } });
    fireEvent.change(screen.getByTestId("input-url"), { target: { value: "https://newlink.com" } });
    fireEvent.change(screen.getByTestId("file-lightImage"), { target: { value: "/light.png" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetLinks).toHaveBeenCalled();
    });
  });

  it("updates links state after successful update", async () => {
    const existingLink = {
      id: "1",
      name: "Existing",
      url: "https://existing.com",
      image: { light: "/light.png" },
    };

    render(
      <LinkForm
        t={mockT}
        setOpen={mockSetOpen}
        link={existingLink}
        setLinks={mockSetLinks}
      />
    );

    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Updated" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetLinks).toHaveBeenCalled();
    });
  });
});
