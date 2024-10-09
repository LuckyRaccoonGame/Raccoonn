import React from 'react';
import { User } from '../types';

interface StatsPageProps {
  user: User;
}

const StatsPage: React.FC<StatsPageProps> = ({ user }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Estadísticas</h1>
      <div className="bg-gray-800 p-4 rounded-lg">
        <p>Niveles: ['Bronce', 'Plata', 'Oro', 'Platino', 'Diamante', 'Maestro', 'Gran Maestro', 'Leyenda', 'Mítico', 'Divino'];
</p>
        <p>Nivel: {user.level}</p>
        <p>Puntos totales: {user.points.toFixed(2)}</p>
        <p>Puntos por hora: {user.pointsPerHour.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default StatsPage;