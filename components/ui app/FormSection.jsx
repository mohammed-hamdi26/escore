function FormSection({ children, title, icon, badge, className = "" }) {
  return (
    <div className={`bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none p-6 md:p-8 space-y-6 ${className}`}>
      {(title || icon || badge) && (
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="size-10 rounded-xl bg-green-primary/10 flex items-center justify-center">
                <span className="text-green-primary">{icon}</span>
              </div>
            )}
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
          </div>
          {badge && badge}
        </div>
      )}
      {children}
    </div>
  );
}

export default FormSection;
