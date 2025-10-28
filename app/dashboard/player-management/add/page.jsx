import { getCountries } from "@/app/_Lib/countriesApi";
import AddPlayerFrom from "@/components/Player Management/AddPlayerFrom";

async function page() {
  const data = await getCountries();
  console.log(data);
  return <AddPlayerFrom data={data} />;
}

export default page;
