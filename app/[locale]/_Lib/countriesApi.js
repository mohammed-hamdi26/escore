import axios from "axios";

export async function getCountries() {
  try {
    const res = await axios.get(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    );

    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get countries");
  }
}
