function FormSection({ children, title, icon, badge }) {
  return (
    <div className="bg-dashboard-box dark:bg-[#10131D] px-8 md:px-16 py-10 space-y-8 rounded-2xl">
      {(title || icon || badge) && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon && <span className="text-green-primary">{icon}</span>}
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          </div>
          {badge && badge}
        </div>
      )}
      {children}
    </div>
  );
}

export default FormSection;
