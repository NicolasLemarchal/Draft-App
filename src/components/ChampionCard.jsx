import "./ChampionCard.css";

export default function ChampionCard({ champion, onClick, onRemove }) {
  const getTierColor = (tier) => {
    switch (tier) {
      case "S+":
        return "#FFA51A";
      case "S":
        return "#3E99FA";
      case "A":
        return "#76B3F3";
      case "B":
        return "white";
      case "C":
        return "#FB9799";
      case "D":
        return "crimson";
      case "?":
        return "darkviolet";
      default:
        return "white";
    }
  };

  return (
    <div className="champion-card" onClick={onClick}>
      {champion ? (
        <>
          <div className="remove-button" onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}>✕</div>
          <img src={champion.img} alt={champion.name} width="64" />
          <h3>{champion.name}</h3>
          <p className="tier" style={{ color: getTierColor(champion.tier) }}>
            {champion.tier != null ? `${champion.tier}` : `N/A`}
          </p>
          <p className="winrate">
            {champion.winrate != null ? `${champion.winrate}%` : `N/A`}
          </p>
          <div className="complementary-infos">
             <p className="pickrate">
              {champion.pickrate != null ? `${champion.pickrate}%` : `N/A`}
            </p>
            <p className="banrate">
              {champion.banrate != null ? `${champion.banrate}%` : `N/A`}
            </p>
          </div>
        </>
      ) : (
        <p>Choisir...</p>
      )}
    </div>
  );
}
