import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminNavigationBar from './AdminNavigationBar';
import './subcontentCruds.css';
import API_BASE_URL from '../../config'; // Importa la URL base desde config.js

function SubcontentCruds() {
  const [contents, setContents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}contents`);
      const data = await response.json();
      
      const sortedContents = data.data.sort((a, b) => a.id - b.id);
      setContents(sortedContents);
    } catch (error) {
      console.error('Error fetching contents:', error);
    }
  };

  const handleEditContent = (contentId) => {
    navigate(`/subcontentsCruds2/${contentId}`);
  };

  return (
    <div className="admin-home-page">
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-content">
        <div className="admin-content__container">
          <h2 className="admin-content__title">Contenidos</h2>
          <p className="admin-content__subtitle">Escoga el contenido al que quiere añadir subcontenidos</p>
          <div className="admin-content__inner">
            <div className="contents-container">
              {contents.map((content, index) => (
                <div
                  className="content-card"
                  key={index}
                  onClick={() => handleEditContent(content.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <p>Nombre: {content.attributes.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubcontentCruds;
