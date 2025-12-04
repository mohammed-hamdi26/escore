import LinksButtons from "@/components/ui app/LinksButtons";

function layout({ children }) {
  return (
    <div>
      <LinksButtons />
      {children}
    </div>
  );
}

export default layout;
