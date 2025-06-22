import { useState, useEffect } from "react";
import ChampionCard from "../components/ChampionCard";
import ChampionPicker from "../components/ChampionPicker";
import "./DraftPage.css";

export default function DraftPage() {
  const [team, setTeam] = useState([null, null, null, null, null]);
  const [modalIndex, setModalIndex] = useState(null);

  const handleChampionSelect = (champ) => {
    const positionMap = ["top", "jgl", "mid", "bot", "sup"];
    const role = positionMap[modalIndex];
    const tier = champ.tier?.[role] ?? null;
    const winrate = champ.winrate?.[role] ?? null;
    const pickrate = champ.pickrate?.[role] ?? null;
    const banrate = champ.banrate ?? null;
    const updated = [...team];
    updated[modalIndex] = { ...champ, tier, winrate, pickrate, banrate };
    setTeam(updated);
    setModalIndex(null);
  };

  const averageWR = () => {
    const values = team.map((c) => c?.winrate).filter((w) => w != null);
    if (values.length === 0) return "N/A";
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) + "%";
  };

  const removeChampion = (index) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  return (
    <div className="draft-page">
      <h1>Draft équipe</h1>
      <div className="draft-team">
        {team.map((champ, i) => (
          <ChampionCard
            key={i}
            champion={champ}
            onClick={() => setModalIndex(i)}
            onRemove={() => removeChampion(i)}
          />
        ))}
      </div>
      <h2>Winrate moyen : {averageWR()}</h2>

      <ChampionPicker
        isOpen={modalIndex !== null}
        onSelect={handleChampionSelect}
        onClose={() => setModalIndex(null)}
      />
    </div>
  );
}
