import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { utils, writeFile } from 'xlsx';
import AdminHeader from './AdminHeader'; // Importa el componente AdminHeader
import AdminNavigationBar from './AdminNavigationBar'; // Importa la barra de navegación
import API_BASE_URL from '../../config'; // Importa la URL base desde config.js
import './CalificacionCruds.css'; // Importa los estilos CSS

function CalificacionCruds() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}results?populate=*`);
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    const student = result.attributes.users_permissions_user.data;
    if (!acc[student.id]) {
      acc[student.id] = {
        name: `${student.attributes.name} ${student.attributes.lastname}`,
        grades: []
      };
    }
    acc[student.id].grades.push({
      testName: result.attributes.name,
      grade: result.attributes.grades
    });
    return acc;
  }, {});

  const exportToExcel = () => {
    const data = [];

    Object.values(groupedResults).forEach(student => {
      student.grades.forEach((grade, idx) => {
        data.push({
          Estudiante: student.name,
          Prueba: grade.testName,
          Nota: grade.grade
        });
      });
    });

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Calificaciones");
    writeFile(workbook, "calificaciones.xlsx");
  };

  return (
    <div className="admin-home-page">
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-content">
        <div className="admin-content__container">
          <h2 className="admin-content__title">Calificaciones del Estudiante</h2>
          <button className="export-button" onClick={exportToExcel}>Exportar a Excel</button>
          <div className="admin-content__inner">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Pruebas</th>
                  <th>Notas</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(groupedResults).map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>
                      {student.grades.map((grade, idx) => (
                        <p key={idx}>{grade.testName}</p>
                      ))}
                    </td>
                    <td>
                      {student.grades.map((grade, idx) => (
                        <p key={idx}>{grade.grade}</p>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalificacionCruds;
