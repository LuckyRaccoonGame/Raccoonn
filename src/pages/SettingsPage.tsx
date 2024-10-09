import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>
      <div className="bg-gray-800 p-4 rounded-lg">
        <p>Aquí puedes agregar opciones de configuración como:</p>
        <ul className="list-disc list-inside">
          <li>Cambiar el nombre de usuario</li>
          <li>Ajustar el volumen de los efectos de sonido</li>
          <li>Cambiar el tema de la aplicación</li>
          <li>Opciones de notificaciones</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;