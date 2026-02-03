import NewsHeader from "@/components/News/NewsHeader";

function NewsLayout({ children }) {
  return (
    <div className="space-y-6">
      {/* Page Header - conditionally rendered based on route */}
      <NewsHeader />

      {/* Content */}
      {children}
    </div>
  );
}

export default NewsLayout;
