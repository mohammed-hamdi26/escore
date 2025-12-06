import { render, screen, fireEvent } from "@testing-library/react";
import ImageCropper from "@/components/ui app/ImageCropper";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => {
    const translations = {
      title: "Crop Image",
      aspectRatio: "Aspect Ratio",
      free: "Free",
      zoom: "Zoom",
      cancel: "Cancel",
      apply: "Apply Crop",
      reset: "Reset",
    };
    return translations[key] || key;
  },
}));

// Mock react-image-crop
jest.mock("react-image-crop", () => ({
  __esModule: true,
  default: ({ children, onChange, onComplete }) => (
    <div data-testid="react-crop">{children}</div>
  ),
}));

// Mock radix dialog
jest.mock("@radix-ui/react-dialog", () => ({
  Root: ({ children, open }) => (open ? <div data-testid="dialog">{children}</div> : null),
  Trigger: ({ children }) => children,
  Portal: ({ children }) => children,
  Overlay: ({ children }) => <div data-testid="dialog-overlay">{children}</div>,
  Content: ({ children }) => <div data-testid="dialog-content">{children}</div>,
  Title: ({ children }) => <h2>{children}</h2>,
  Description: ({ children }) => <p>{children}</p>,
  Close: ({ children }) => <button data-testid="dialog-close">{children}</button>,
}));

// Mock radix slider
jest.mock("@radix-ui/react-slider", () => ({
  Root: ({ children, ...props }) => <div data-testid="slider" {...props}>{children}</div>,
  Track: ({ children }) => <div>{children}</div>,
  Range: () => <div />,
  Thumb: () => <div />,
}));

describe("ImageCropper", () => {
  const mockOnClose = jest.fn();
  const mockOnCropComplete = jest.fn();
  const testImageSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog when isOpen is true", () => {
    render(
      <ImageCropper
        isOpen={true}
        onClose={mockOnClose}
        imageSrc={testImageSrc}
        onCropComplete={mockOnCropComplete}
      />
    );
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("does not render dialog when isOpen is false", () => {
    render(
      <ImageCropper
        isOpen={false}
        onClose={mockOnClose}
        imageSrc={testImageSrc}
        onCropComplete={mockOnCropComplete}
      />
    );
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("displays the title", () => {
    render(
      <ImageCropper
        isOpen={true}
        onClose={mockOnClose}
        imageSrc={testImageSrc}
        onCropComplete={mockOnCropComplete}
      />
    );
    expect(screen.getByText("Crop Image")).toBeInTheDocument();
  });

  it("displays aspect ratio options", () => {
    render(
      <ImageCropper
        isOpen={true}
        onClose={mockOnClose}
        imageSrc={testImageSrc}
        onCropComplete={mockOnCropComplete}
      />
    );
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("1:1")).toBeInTheDocument();
    expect(screen.getByText("16:9")).toBeInTheDocument();
    expect(screen.getByText("4:3")).toBeInTheDocument();
  });

  it("displays zoom label", () => {
    render(
      <ImageCropper
        isOpen={true}
        onClose={mockOnClose}
        imageSrc={testImageSrc}
        onCropComplete={mockOnCropComplete}
      />
    );
    expect(screen.getByText("Zoom")).toBeInTheDocument();
  });

  it("displays cancel and apply buttons", () => {
    render(
      <ImageCropper
        isOpen={true}
        onClose={mockOnClose}
        imageSrc={testImageSrc}
        onCropComplete={mockOnCropComplete}
      />
    );
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Apply Crop")).toBeInTheDocument();
  });

  it("displays reset button", () => {
    render(
      <ImageCropper
        isOpen={true}
        onClose={mockOnClose}
        imageSrc={testImageSrc}
        onCropComplete={mockOnCropComplete}
      />
    );
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("calls onClose when cancel is clicked", () => {
    render(
      <ImageCropper
        isOpen={true}
        onClose={mockOnClose}
        imageSrc={testImageSrc}
        onCropComplete={mockOnCropComplete}
      />
    );
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("renders the image with correct src", () => {
    render(
      <ImageCropper
        isOpen={true}
        onClose={mockOnClose}
        imageSrc={testImageSrc}
        onCropComplete={mockOnCropComplete}
      />
    );
    const image = screen.getByAltText("Crop preview");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", testImageSrc);
  });

  it("renders slider component", () => {
    render(
      <ImageCropper
        isOpen={true}
        onClose={mockOnClose}
        imageSrc={testImageSrc}
        onCropComplete={mockOnCropComplete}
      />
    );
    expect(screen.getByTestId("slider")).toBeInTheDocument();
  });

  it("displays zoom percentage", () => {
    render(
      <ImageCropper
        isOpen={true}
        onClose={mockOnClose}
        imageSrc={testImageSrc}
        onCropComplete={mockOnCropComplete}
      />
    );
    // Default zoom is 100%
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
