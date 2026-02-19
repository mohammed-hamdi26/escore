"use client";

import { getImgUrl } from "@/lib/utils";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import * as Yup from "yup";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Label } from "../ui/label";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import {
  User,
  Users,
  Gamepad2,
  DollarSign,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import RichTextEditor from "../ui app/RichTextEditor";

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "SAR", label: "SAR - Saudi Riyal" },
  { value: "AED", label: "AED - UAE Dirham" },
];

function TransfersForm({
  formType = "add",
  gamesOptions = [],
  playersOptions = [],
  teamsOptions = [],
  transfer,
  submit,
}) {
  const t = useTranslations("TransfersManagement");
  const router = useRouter();

  // Popover states
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerSearch, setPlayerSearch] = useState("");
  const [gameOpen, setGameOpen] = useState(false);
  const [gameSearch, setGameSearch] = useState("");
  const [fromTeamOpen, setFromTeamOpen] = useState(false);
  const [fromTeamSearch, setFromTeamSearch] = useState("");
  const [toTeamOpen, setToTeamOpen] = useState(false);
  const [toTeamSearch, setToTeamSearch] = useState("");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const validationSchema = Yup.object({
    player: Yup.string().required("Player is required"),
    game: Yup.string().required("Game is required"),
    fromTeam: Yup.string().nullable(),
    toTeam: Yup.string().nullable(),
    fee: Yup.number().min(0, "Fee must be positive").nullable(),
    transferDate: Yup.string().nullable(),
    content: Yup.string().nullable(),
  }).test(
    "at-least-one-team",
    "At least one team (From or To) is required",
    function (values) {
      return values.fromTeam || values.toTeam;
    }
  );

  const formik = useFormik({
    initialValues: {
      player: transfer?.player?.id || transfer?.player?._id || "",
      game: transfer?.game?.id || transfer?.game?._id || "",
      fromTeam: transfer?.fromTeam?.id || transfer?.fromTeam?._id || "",
      toTeam: transfer?.toTeam?.id || transfer?.toTeam?._id || "",
      fee: transfer?.fee || "",
      currency: transfer?.currency || "USD",
      transferDate: transfer?.transferDate
        ? transfer.transferDate.split("T")[0]
        : "",
      content: transfer?.content || "",
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        const dataValues = {
          ...values,
          fee: values.fee ? Number(values.fee) : undefined,
          fromTeam: values.fromTeam || undefined,
          toTeam: values.toTeam || undefined,
          game: values.game,
          transferDate: values.transferDate || undefined,
          content: values.content || undefined,
        };

        if (transfer) {
          dataValues.id = transfer.id || transfer._id;
        }

        const result = await submit(dataValues);

        if (result?.success) {
          toast.success(
            formType === "add"
              ? t("Transfer added successfully")
              : t("Transfer updated successfully")
          );
          if (formType === "add") {
            formik.resetForm();
          }
          router.push("/dashboard/transfers-management");
        } else {
          toast.error(result?.error || t("An error occurred"));
        }
      } catch (error) {
        toast.error(t("An error occurred"));
      }
    },
  });

  // Auto-set game and fromTeam when player is selected
  const handlePlayerChange = async (playerId) => {
    await formik.setFieldValue("player", playerId);
    formik.validateField("player");

    const player = playersOptions.find(
      (p) => (p.id || p._id) === playerId
    );

    if (player) {
      // Check if player has gameRosters (new format)
      if (player.gameRosters && player.gameRosters.length > 0) {
        if (player.gameRosters.length === 1) {
          // Single game: auto-set game and fromTeam
          const roster = player.gameRosters[0];
          const gameId = typeof roster.game === 'string'
            ? roster.game
            : (roster.game?._id || roster.game?.id);
          if (gameId) {
            await formik.setFieldValue("game", gameId);
          }
          const teamId = typeof roster.team === 'string'
            ? roster.team
            : (roster.team?._id || roster.team?.id);
          if (teamId) {
            await formik.setFieldValue("fromTeam", teamId);
          } else {
            await formik.setFieldValue("fromTeam", "");
          }
        } else {
          // Multiple games: clear game and fromTeam, let user choose
          await formik.setFieldValue("game", "");
          await formik.setFieldValue("fromTeam", "");
        }
      } else {
        // Legacy format: single game/team
        if (player.game) {
          const gameId = typeof player.game === 'string'
            ? player.game
            : (player.game._id || player.game.id);
          if (gameId) {
            await formik.setFieldValue("game", gameId);
          }
        }

        if (player.team) {
          const teamId = typeof player.team === 'string'
            ? player.team
            : (player.team._id || player.team.id);
          if (teamId) {
            await formik.setFieldValue("fromTeam", teamId);
          }
        } else {
          await formik.setFieldValue("fromTeam", "");
        }
      }
    }
  };

  // Auto-set fromTeam when game is selected (look up player's roster for that game)
  const handleGameChange = async (gameId) => {
    await formik.setFieldValue("game", gameId);
    formik.validateField("game");

    if (!gameId || !formik.values.player) return;

    const player = playersOptions.find(
      (p) => (p.id || p._id) === formik.values.player
    );

    if (player?.gameRosters) {
      const roster = player.gameRosters.find(r => {
        const rGameId = typeof r.game === 'string'
          ? r.game
          : (r.game?._id || r.game?.id);
        return rGameId === gameId;
      });

      if (roster?.team) {
        const teamId = typeof roster.team === 'string'
          ? roster.team
          : (roster.team?._id || roster.team?.id);
        if (teamId) {
          await formik.setFieldValue("fromTeam", teamId);
        } else {
          await formik.setFieldValue("fromTeam", "");
        }
      } else {
        await formik.setFieldValue("fromTeam", "");
      }
    }
  };

  // Filtered options
  const filteredPlayers = useMemo(() => {
    if (!playerSearch) return playersOptions;
    return playersOptions.filter((player) =>
      (player.nickname || player.name || "").toLowerCase().includes(playerSearch.toLowerCase())
    );
  }, [playersOptions, playerSearch]);

  const filteredGames = useMemo(() => {
    if (!gameSearch) return gamesOptions;
    return gamesOptions.filter((game) =>
      game.name.toLowerCase().includes(gameSearch.toLowerCase())
    );
  }, [gamesOptions, gameSearch]);

  const filteredFromTeams = useMemo(() => {
    const teams = teamsOptions.filter(
      (team) => (team.id || team._id) !== formik.values.toTeam
    );
    if (!fromTeamSearch) return teams;
    return teams.filter((team) =>
      team.name.toLowerCase().includes(fromTeamSearch.toLowerCase())
    );
  }, [teamsOptions, fromTeamSearch, formik.values.toTeam]);

  const filteredToTeams = useMemo(() => {
    const teams = teamsOptions.filter(
      (team) => (team.id || team._id) !== formik.values.fromTeam
    );
    if (!toTeamSearch) return teams;
    return teams.filter((team) =>
      team.name.toLowerCase().includes(toTeamSearch.toLowerCase())
    );
  }, [teamsOptions, toTeamSearch, formik.values.fromTeam]);

  // Get selected names
  const selectedPlayer = playersOptions.find(
    (p) => (p.id || p._id) === formik.values.player
  );
  const selectedGame = gamesOptions.find(
    (g) => (g.id || g._id) === formik.values.game
  );
  const selectedFromTeam = teamsOptions.find(
    (t) => (t.id || t._id) === formik.values.fromTeam
  );
  const selectedToTeam = teamsOptions.find(
    (t) => (t.id || t._id) === formik.values.toTeam
  );
  const selectedCurrency = CURRENCY_OPTIONS.find(
    (c) => c.value === formik.values.currency
  );

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      {/* Player & Game Section */}
      <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <User className="size-5 text-green-primary" />
          {t("Basic Information")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Player Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <User className="size-4" />
              {t("Player")} <span className="text-red-500">*</span>
            </Label>
            <Popover open={playerOpen} onOpenChange={setPlayerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={playerOpen}
                  className={`w-full h-12 justify-between rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-muted dark:hover:bg-[#252a3d] ${
                    formik.touched.player && formik.errors.player ? "border-red-500" : ""
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {selectedPlayer ? (
                      <>
                        {selectedPlayer.photo && (
                          <img
                            src={getImgUrl(selectedPlayer.photo.light, "thumbnail") || getImgUrl(selectedPlayer.photo, "thumbnail")}
                            alt=""
                            className="size-6 rounded-full object-cover"
                          />
                        )}
                        <span className="text-foreground truncate">
                          {selectedPlayer.nickname || selectedPlayer.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">{t("Select Player")}</span>
                    )}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={t("searchPlayer")}
                    value={playerSearch}
                    onValueChange={setPlayerSearch}
                  />
                  <CommandList>
                    <CommandEmpty>{t("noPlayerFound")}</CommandEmpty>
                    <CommandGroup>
                      {filteredPlayers.map((player) => {
                        const playerId = player.id || player._id;
                        return (
                          <CommandItem
                            key={playerId}
                            value={player.nickname || player.name}
                            onSelect={() => {
                              handlePlayerChange(playerId);
                              setPlayerOpen(false);
                              setPlayerSearch("");
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                formik.values.player === playerId ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {player.photo && (
                              <img
                                src={getImgUrl(player.photo.light, "thumbnail") || getImgUrl(player.photo, "thumbnail")}
                                alt=""
                                className="size-6 rounded-full mr-2 object-cover"
                              />
                            )}
                            <span className="truncate">{player.nickname || player.name}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {formik.touched.player && formik.errors.player && (
              <p className="text-red-500 text-sm">{formik.errors.player}</p>
            )}
          </div>

          {/* Game Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Gamepad2 className="size-4" />
              {t("Game")} <span className="text-red-500">*</span>
            </Label>
            <Popover open={gameOpen} onOpenChange={setGameOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={gameOpen}
                  className={`w-full h-12 justify-between rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-muted dark:hover:bg-[#252a3d] ${
                    formik.touched.game && formik.errors.game ? "border-red-500" : ""
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {selectedGame ? (
                      <>
                        {selectedGame.logo && (
                          <img
                            src={getImgUrl(selectedGame.logo.light, "thumbnail") || getImgUrl(selectedGame.logo.dark, "thumbnail")}
                            alt=""
                            className="size-6 rounded object-contain"
                          />
                        )}
                        <span className="text-foreground truncate">{selectedGame.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">{t("Select Game")}</span>
                    )}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={t("searchGame")}
                    value={gameSearch}
                    onValueChange={setGameSearch}
                  />
                  <CommandList>
                    <CommandEmpty>{t("noGameFound")}</CommandEmpty>
                    <CommandGroup>
                      {filteredGames.map((game) => {
                        const gameId = game.id || game._id;
                        return (
                          <CommandItem
                            key={gameId}
                            value={game.name}
                            onSelect={() => {
                              handleGameChange(gameId);
                              setGameOpen(false);
                              setGameSearch("");
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                formik.values.game === gameId ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {game.logo && (
                              <img
                                src={getImgUrl(game.logo.light, "thumbnail") || getImgUrl(game.logo.dark, "thumbnail")}
                                alt=""
                                className="size-6 rounded mr-2 object-contain"
                              />
                            )}
                            <span className="truncate">{game.name}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {formik.touched.game && formik.errors.game && (
              <p className="text-red-500 text-sm">{formik.errors.game}</p>
            )}
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Users className="size-5 text-green-primary" />
          {t("Teams")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* From Team */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("From Team")}
            </Label>
            <Popover open={fromTeamOpen} onOpenChange={setFromTeamOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={fromTeamOpen}
                  className="w-full h-12 justify-between rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-muted dark:hover:bg-[#252a3d]"
                >
                  <span className="flex items-center gap-2 truncate">
                    {selectedFromTeam ? (
                      <>
                        {selectedFromTeam.logo && (
                          <img
                            src={getImgUrl(selectedFromTeam.logo.light, "thumbnail") || getImgUrl(selectedFromTeam.logo.dark, "thumbnail")}
                            alt=""
                            className="size-6 rounded object-contain"
                          />
                        )}
                        <span className="text-foreground truncate">{selectedFromTeam.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">{t("Free Agent")}</span>
                    )}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={t("searchTeam")}
                    value={fromTeamSearch}
                    onValueChange={setFromTeamSearch}
                  />
                  <CommandList>
                    <CommandEmpty>{t("noTeamFound")}</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="free-agent"
                        onSelect={() => {
                          formik.setFieldValue("fromTeam", "");
                          formik.validateField("fromTeam");
                          setFromTeamOpen(false);
                          setFromTeamSearch("");
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${!formik.values.fromTeam ? "opacity-100" : "opacity-0"}`}
                        />
                        <User className="size-5 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">{t("Free Agent")}</span>
                      </CommandItem>
                      {filteredFromTeams.map((team) => {
                        const teamId = team.id || team._id;
                        return (
                          <CommandItem
                            key={teamId}
                            value={team.name}
                            onSelect={() => {
                              formik.setFieldValue("fromTeam", teamId);
                              formik.validateField("fromTeam");
                              setFromTeamOpen(false);
                              setFromTeamSearch("");
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                formik.values.fromTeam === teamId ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {team.logo && (
                              <img
                                src={getImgUrl(team.logo.light, "thumbnail") || getImgUrl(team.logo.dark, "thumbnail")}
                                alt=""
                                className="size-6 rounded mr-2 object-contain"
                              />
                            )}
                            <span className="truncate">{team.name}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center pb-2">
            <ArrowRight className="size-8 text-green-primary" />
          </div>

          {/* To Team */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("To Team")}
            </Label>
            <Popover open={toTeamOpen} onOpenChange={setToTeamOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={toTeamOpen}
                  className="w-full h-12 justify-between rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-muted dark:hover:bg-[#252a3d]"
                >
                  <span className="flex items-center gap-2 truncate">
                    {selectedToTeam ? (
                      <>
                        {selectedToTeam.logo && (
                          <img
                            src={getImgUrl(selectedToTeam.logo.light, "thumbnail") || getImgUrl(selectedToTeam.logo.dark, "thumbnail")}
                            alt=""
                            className="size-6 rounded object-contain"
                          />
                        )}
                        <span className="text-foreground truncate">{selectedToTeam.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">{t("selectTeam")}</span>
                    )}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={t("searchTeam")}
                    value={toTeamSearch}
                    onValueChange={setToTeamSearch}
                  />
                  <CommandList>
                    <CommandEmpty>{t("noTeamFound")}</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="no-team"
                        onSelect={() => {
                          formik.setFieldValue("toTeam", "");
                          formik.validateField("toTeam");
                          setToTeamOpen(false);
                          setToTeamSearch("");
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${!formik.values.toTeam ? "opacity-100" : "opacity-0"}`}
                        />
                        <span className="text-muted-foreground">{t("noTeam")}</span>
                      </CommandItem>
                      {filteredToTeams.map((team) => {
                        const teamId = team.id || team._id;
                        return (
                          <CommandItem
                            key={teamId}
                            value={team.name}
                            onSelect={() => {
                              formik.setFieldValue("toTeam", teamId);
                              formik.validateField("toTeam");
                              setToTeamOpen(false);
                              setToTeamSearch("");
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                formik.values.toTeam === teamId ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {team.logo && (
                              <img
                                src={getImgUrl(team.logo.light, "thumbnail") || getImgUrl(team.logo.dark, "thumbnail")}
                                alt=""
                                className="size-6 rounded mr-2 object-contain"
                              />
                            )}
                            <span className="truncate">{team.name}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {formik.errors["at-least-one-team"] && (
          <p className="text-red-500 text-sm mt-4">
            {t("atLeastOneTeamRequired")}
          </p>
        )}
      </div>

      {/* Financial Details Section */}
      <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <DollarSign className="size-5 text-green-primary" />
          {t("Financial Details")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transfer Fee */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("Transfer Fee")}
            </Label>
            <input
              type="number"
              name="fee"
              value={formik.values.fee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("Enter Fee")}
              disabled={formik.isSubmitting}
              className="w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50"
            />
            {formik.touched.fee && formik.errors.fee && (
              <p className="text-red-500 text-sm">{formik.errors.fee}</p>
            )}
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("Currency")}
            </Label>
            <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={currencyOpen}
                  className="w-full h-12 justify-between rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-muted dark:hover:bg-[#252a3d]"
                >
                  <span className="text-foreground">
                    {selectedCurrency?.label || "USD - US Dollar"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {CURRENCY_OPTIONS.map((currency) => (
                        <CommandItem
                          key={currency.value}
                          value={currency.value}
                          onSelect={() => {
                            formik.setFieldValue("currency", currency.value);
                            setCurrencyOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              formik.values.currency === currency.value ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {currency.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Date & Additional Info Section */}
      <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <CalendarDays className="size-5 text-green-primary" />
          {t("dateAndAdditionalInfo")}
        </h3>
        {/* Transfer Date */}
        <TransferDatePicker
          value={formik.values.transferDate}
          onChange={async (date) => {
            await formik.setFieldValue("transferDate", date);
          }}
          onClear={async () => {
            await formik.setFieldValue("transferDate", "");
          }}
          isOpen={dateOpen}
          setIsOpen={setDateOpen}
          viewDate={viewDate}
          setViewDate={setViewDate}
          placeholder={t("selectTransferDate") || "Select transfer date"}
          label={t("Transfer Date")}
        />

        {/* Content */}
        <div className="mt-6">
          <RichTextEditor
            name="content"
            formik={formik}
            label={t("Content")}
            placeholder={t("enterContent")}
            error={
              formik.touched.content &&
              formik.errors.content &&
              formik.errors.content
            }
            minHeight="300px"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={formik.isSubmitting}
          className="h-11 px-6 rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {t("Cancel")}
        </Button>
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className="h-11 px-8 rounded-xl bg-green-primary hover:bg-green-primary/90 text-white font-medium"
        >
          {formik.isSubmitting ? (
            <Spinner />
          ) : formType === "add" ? (
            t("Add Transfer")
          ) : (
            t("Save Changes")
          )}
        </Button>
      </div>
    </form>
  );
}

// Transfer Date Picker Component
function TransferDatePicker({
  value,
  onChange,
  onClear,
  isOpen,
  setIsOpen,
  viewDate,
  setViewDate,
  placeholder,
  label,
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 10 }, (_, i) => 2000 + i).reverse();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSelect = (date) => {
    if (date) {
      const formattedDate = formatLocalDate(date);
      onChange(formattedDate);
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onClear();
  };

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(monthIndex);
    setViewDate(newDate);
  };

  const handleYearChange = (year) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };

  const selectedDate = value ? new Date(value) : undefined;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className="w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-green-primary/10 flex items-center justify-center">
                <CalendarDays className="size-5 text-green-primary" />
              </div>
              {value ? (
                <span className="text-foreground font-medium">
                  {formatDisplayDate(value)}
                </span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            {value && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                className="size-7 rounded-lg bg-muted hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
              >
                <X className="size-4 text-muted-foreground group-hover:text-red-500" />
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-background dark:bg-[#12141c] border-border"
          align="start"
        >
          {/* Year/Month Navigation */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="size-8 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="size-4 text-foreground rtl:rotate-180" />
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={viewDate.getMonth()}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="h-8 px-2 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={viewDate.getFullYear()}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="h-8 px-2 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={goToNextMonth}
                className="size-8 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="size-4 text-foreground rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Calendar */}
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={viewDate}
            onMonthChange={setViewDate}
            initialFocus
            className="rounded-xl"
            classNames={{
              nav: "hidden",
              caption: "hidden",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default TransfersForm;
