import LinkButtonsUsers from "@/components/ui app/LinkButtonsUsers";
async function layout({ children, params }) {
  const userId = await params.userId;
  return (
    <div>
      <LinkButtonsUsers userId={userId} />
      {children}
    </div>
  );
}

export default layout;
