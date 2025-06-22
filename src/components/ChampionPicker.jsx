import { useEffect, useState } from "react";
import "./ChampionPicker.css";

export default function ChampionPicker({ isOpen, onSelect, onClose }) {
  const [champions, setChampions] = useState([]);

  useEffect(() => {
    fetch("/champions.json")
      .then((res) => res.json())
      .then(setChampions);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Choisis un champion</h3>
        <div className="champion-gallery">
          {champions.map((champ) => (
            <div
              key={champ.name}
              onClick={() => onSelect(champ)}
              className="champion-option"
            >
              <img src={champ.img} alt={champ.name} width="64" />
              <p>{champ.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
