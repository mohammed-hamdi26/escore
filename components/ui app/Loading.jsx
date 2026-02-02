function Loading({ size = "default", text = "Loading..." }) {
  const sizeClasses = {
    small: "size-6",
    default: "size-10",
    large: "size-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {/* Animated spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-2 border-muted/30 dark:border-white/10`}
        />
        {/* Spinning arc */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-green-primary animate-spin`}
          style={{ animationDuration: "0.8s" }}
        />
        {/* Inner glow dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-2 rounded-full bg-green-primary animate-pulse glow-green-subtle" />
        </div>
      </div>

      {/* Loading text */}
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}

// Full page loading variant
Loading.Page = function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loading size="large" />
    </div>
  );
};

// Inline loading variant
Loading.Inline = function InlineLoading() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="size-4 rounded-full border-2 border-transparent border-t-green-primary animate-spin" />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </span>
  );
};

// Skeleton loading variant
Loading.Skeleton = function SkeletonLoading({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-muted/50 dark:bg-white/5 rounded-lg ${className}`}
    />
  );
};

export default Loading;
