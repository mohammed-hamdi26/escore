import { useFormik } from "formik";
import * as Yup from "yup";
import ComboboxInput from "../ui app/ComboBoxInput";
import { DialogTitle } from "../ui/dialog";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { Button } from "../ui/button";
import { id } from "date-fns/locale";
// import { addLineUp } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getLineups } from "@/app/[locale]/_Lib/lineupsApi";
function TeamLineup({ t, title, players, match, setOpen, dialogType }) {
  const [playersLineup, setPlayersLineup] = useState([]);

  const schemaValidation = Yup.object({});

  const team = dialogType === "team1" ? match.teams[0] : match.teams[1];

  const formik = useFormik({
    initialValues: {
      match: { id: match.id },
      players: players || [],
      team: {
        id: team.id,
      },
    },
    onSubmit: async (values) => {
      // Handle form submission
      try {
        await addLineUp(values);
        toast.success(t("Lineup added successfully"));
        formik.resetForm();
        setOpen(false);
      } catch (err) {
        console.log(err);
        toast.error(t("Error adding lineup"));
      }
    },
  });
  // console.log(formik.values);

  // useEffect(() => {
  //   async function getTeamLineup() {
  //     try {
  //       const players = await getLineups(team.id);
  //       // setPlayers(res);
  //       setPlayersLineup(players);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getTeamLineup();
  //   return () => {
  //     getTeamLineup();
  //   };
  // }, []);

  console.log(playersLineup);
  return (
    <>
      <DialogTitle>
        {title} {team.name}
      </DialogTitle>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        <ComboboxInput
          formik={formik}
          placeholder={t("Select a player")}
          name={"players"}
          label={t("Player")}
          options={mappedArrayToSelectOptions(players, "firstName", "id")}
        />

        <Button type="submit" className="w-full bg-green-primary text-white">
          {t("Add Lineup")}
        </Button>
      </form>
    </>
  );
}

export default TeamLineup;
