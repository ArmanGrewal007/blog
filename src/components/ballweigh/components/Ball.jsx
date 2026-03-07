export default function Ball({ id, location, onDragStart, onClick }) {
  // location: 'tray' | 'left' | 'right'

  const styles = {
    tray: {
      background: "#1E1308",
      color: "#F0E0C0",
      border: "2px solid #3C2818",
      boxShadow: "0 2px 8px rgba(30,19,8,0.4)",
    },
    left: {
      background: "#0F2140",
      color: "#B8D4F0",
      border: "2px solid #1E3A6E",
      boxShadow: "0 2px 8px rgba(15,33,64,0.4)",
    },
    right: {
      background: "#3A0F25",
      color: "#F0B8D0",
      border: "2px solid #6E1E3A",
      boxShadow: "0 2px 8px rgba(58,15,37,0.4)",
    },
  };

  const label = location === "tray"
    ? "Click to move to Left Pan"
    : location === "left"
      ? "Click to move to Right Pan"
      : "Click to return to Tray";

  return (
    <button
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("ballId", String(id));
        e.dataTransfer.setData("fromZone", location);
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(id);
      }}
      onClick={() => onClick(id)}
      title={label}
      className="w-11 h-11 rounded-full font-bold text-sm flex items-center justify-center cursor-grab active:cursor-grabbing select-none transition-transform duration-150 hover:scale-110 active:scale-95"
      style={styles[location]}
    >
      {id}
    </button>
  );
}
