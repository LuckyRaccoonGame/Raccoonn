interface ClickerCircleProps {
  onClick: () => void;
}

const ClickerCircle: React.FC<ClickerCircleProps> = ({ onClick }) => {
  return (
    <div
      className="w-48 h-48,1 flex items-center justify-center cursor-pointer rotate-on-click"
      onClick={onClick}
    >
      <img
        src="/src/images/Personaje-Lvl-1.png" // Reemplaza con la URL real de la imagen
        alt="Raccoon Clicker"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default ClickerCircle;