import React from 'react';
import AdminHeader from './AdminHeader'; // Importa el componente AdminHeader
import AdminNavigationBar from './AdminNavigationBar'; // Importa la barra de navegación

function ResultadoCruds() {
  return (
    <div className="admin-home-page">
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-content">
        <div className="admin-content__container">
          <h2 className="admin-content__title">Resultados</h2>
          <div className="admin-content__inner">
            {/* Contenido específico de la página ResultadoCruds aquí */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultadoCruds;
