import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileInput from "@/components/ui app/FileInput";

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
  useTranslations: (namespace) => (key) => {
    const translations = {
      toast: {
        "uploaded Photo": "Photo uploaded",
        "error uploading photo": "Error uploading photo",
      },
      imageCropper: {
        title: "Crop Image",
        fileTooLarge: "File size must be less than 5MB",
      },
    };
    return translations[namespace]?.[key] || key;
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

// Mock uploadPhoto action
jest.mock("@/app/[locale]/_Lib/actions", () => ({
  uploadPhoto: jest.fn().mockResolvedValue("https://example.com/image.jpg"),
}));

// Mock ImageCropper
jest.mock("@/components/ui app/ImageCropper", () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onCropComplete }) => (
    isOpen ? (
      <div data-testid="image-cropper">
        <button onClick={onClose} data-testid="cropper-cancel">Cancel</button>
        <button
          onClick={() => onCropComplete(new Blob(["test"], { type: "image/jpeg" }))}
          data-testid="cropper-apply"
        >
          Apply
        </button>
      </div>
    ) : null
  ),
}));

// Mock InputApp
jest.mock("@/components/ui app/InputApp", () => ({
  __esModule: true,
  default: (props) => <input data-testid="input-app" {...props} />,
}));

// Mock ImageIcon
jest.mock("@/components/icons/ImageIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="image-icon" />,
}));

// Mock spinner
jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe("FileInput", () => {
  const mockFormik = {
    values: { testImage: "" },
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    setFieldValue: jest.fn(),
    setFieldError: jest.fn(),
    setFieldTouched: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => "blob:test-url");
    global.URL.revokeObjectURL = jest.fn();
  });

  it("renders file input with label", () => {
    render(
      <FileInput
        formik={mockFormik}
        name="testImage"
        label="Test Image"
        placeholder="Enter image URL"
      />
    );
    expect(screen.getByText("Test Image")).toBeInTheDocument();
  });

  it("renders image icon by default", () => {
    render(
      <FileInput
        formik={mockFormik}
        name="testImage"
      />
    );
    expect(screen.getByTestId("image-icon")).toBeInTheDocument();
  });

  it("opens cropper when file is selected", async () => {
    render(
      <FileInput
        formik={mockFormik}
        name="testImage"
        enableCrop={true}
      />
    );

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    Object.defineProperty(fileInput, "files", {
      value: [file],
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByTestId("image-cropper")).toBeInTheDocument();
    });
  });

  it("shows error when file is too large", async () => {
    const toast = require("react-hot-toast").default;

    render(
      <FileInput
        formik={mockFormik}
        name="testImage"
        enableCrop={true}
      />
    );

    const fileInput = document.querySelector('input[type="file"]');
    // Create a file larger than 5MB
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg"
    });

    Object.defineProperty(fileInput, "files", {
      value: [largeFile],
    });
    Object.defineProperty(largeFile, "size", { value: 6 * 1024 * 1024 });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("sets file after crop is applied", async () => {
    render(
      <FileInput
        formik={mockFormik}
        name="testImage"
        enableCrop={true}
      />
    );

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    Object.defineProperty(fileInput, "files", {
      value: [file],
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByTestId("image-cropper")).toBeInTheDocument();
    });

    const applyButton = screen.getByTestId("cropper-apply");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.queryByTestId("image-cropper")).not.toBeInTheDocument();
    });
  });

  it("closes cropper when cancel is clicked", async () => {
    render(
      <FileInput
        formik={mockFormik}
        name="testImage"
        enableCrop={true}
      />
    );

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    Object.defineProperty(fileInput, "files", {
      value: [file],
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByTestId("image-cropper")).toBeInTheDocument();
    });

    const cancelButton = screen.getByTestId("cropper-cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId("image-cropper")).not.toBeInTheDocument();
    });
  });

  it("skips cropper when enableCrop is false", async () => {
    render(
      <FileInput
        formik={mockFormik}
        name="testImage"
        enableCrop={false}
      />
    );

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    Object.defineProperty(fileInput, "files", {
      value: [file],
    });

    fireEvent.change(fileInput);

    // Cropper should not appear
    expect(screen.queryByTestId("image-cropper")).not.toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const CustomIcon = () => <svg data-testid="custom-icon" />;

    render(
      <FileInput
        formik={mockFormik}
        name="testImage"
        icon={<CustomIcon />}
      />
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
