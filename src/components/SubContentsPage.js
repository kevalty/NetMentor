import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './HeaderLog';
import Sidebar from './Sidebar21';
import './SubContentsPage.css';
import comprobadoIcon from '../assets/comprobado.png';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

const SubContentsPage = () => {
  const [userData, setUserData] = useState(null);
  const [subcontentDetails, setSubcontentDetails] = useState(null);
  const [contentDetails, setContentDetails] = useState(null);
  const [resourceUrl, setResourceUrl] = useState(null);
  const [showMaterialRealizadoButton, setShowMaterialRealizadoButton] = useState(false);
  const [showVideoRealizadoButton, setShowVideoRealizadoButton] = useState(false);
  const [showJuegoRealizadoButton, setShowJuegoRealizadoButton] = useState(false);
  const [materialRealizado, setMaterialRealizado] = useState(false);
  const [videoRealizado, setVideoRealizado] = useState(false);
  const [juegoRealizado, setJuegoRealizado] = useState(false);
  const [clickedLinks, setClickedLinks] = useState({
    material: false,
    video: false,
    juego: false,
  });
  const { contentId, subcontentId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      fetch(`${API_BASE_URL}users/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch user data.'))
        .then(data => setUserData(data))
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}contents/${contentId}?populate=*`);
        if (response.ok) {
          const data = await response.json();
          setContentDetails(data.data.attributes);
        } else {
          console.error('Error fetching content details');
        }
      } catch (error) {
        console.error('Network error fetching content details:', error);
      }
    };

    fetchContentDetails();
  }, [contentId]);

  useEffect(() => {
    const fetchSubcontentDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}subcontents/${subcontentId}`);
        if (response.ok) {
          const data = await response.json();
          const subcontentAttributes = data.data.attributes;
          setSubcontentDetails(subcontentAttributes);

          setClickedLinks({
            material: subcontentAttributes.material_url || false,
            video: subcontentAttributes.video_url || false,
            juego: subcontentAttributes.juego_url || false,
          });
          setMaterialRealizado(subcontentAttributes.material_url || false);
          setVideoRealizado(subcontentAttributes.video_url || false);
          setJuegoRealizado(subcontentAttributes.juego_url || false);
        } else {
          console.error('Error fetching subcontent details');
        }
      } catch (error) {
        console.error('Network error fetching subcontent details:', error);
      }
    };

    fetchSubcontentDetails();
  }, [subcontentId]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setUserData(null);
    navigate('/');
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = (url, type) => {
    setResourceUrl(url);
    setShowMaterialRealizadoButton(type === 'material');
    setShowVideoRealizadoButton(type === 'video');
    setShowJuegoRealizadoButton(type === 'juego');
  };

  const handleContentRealizado = async (type) => {
    const jwt = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}subcontents/${subcontentId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            [type + '_url']: true,
          },
        }),
      });

      if (response.ok) {
        if (type === 'material') {
          setMaterialRealizado(true);
          setClickedLinks(prev => ({ ...prev, material: true }));
        }
        if (type === 'video') {
          setVideoRealizado(true);
          setClickedLinks(prev => ({ ...prev, video: true }));
        }
        if (type === 'juego') {
          setJuegoRealizado(true);
          setClickedLinks(prev => ({ ...prev, juego: true }));
        }
      } else {
        console.error(`Error updating ${type} status`);
      }
    } catch (error) {
      console.error(`Network error updating ${type} status:`, error);
    }
  };

  const handleNavigation = (direction) => {
    if (contentDetails) {
      const subcontents = contentDetails.subcontents.data;
      const currentIndex = subcontents.findIndex(subcontent => subcontent.id.toString() === subcontentId);
      if (direction === 'next' && currentIndex < subcontents.length - 1) {
        const nextSubcontentId = subcontents[currentIndex + 1].id;
        navigate(`/Subcontents/${contentId}/${nextSubcontentId}`);
        clearResourceState();
      } else if (direction === 'prev' && currentIndex > 0) {
        const prevSubcontentId = subcontents[currentIndex - 1].id;
        navigate(`/Subcontents/${contentId}/${prevSubcontentId}`);
        clearResourceState();
      }
    }
  };

  const clearResourceState = () => {
    setResourceUrl(null);
    setShowMaterialRealizadoButton(false);
    setShowVideoRealizadoButton(false);
    setShowJuegoRealizadoButton(false);
  };

  return (
    <div className={`subcontents-page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header userData={userData} handleLogout={handleLogout} />
      <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />
      <div className="subcontents-content-container">
        <div className="subcontents-content-details">
          {subcontentDetails ? (
            <>
              <h1>{subcontentDetails.name}</h1>
              {subcontentDetails.material_url && (
                <>
                  <a className="subcontents-button-link" href="#" onClick={() => handleLinkClick(subcontentDetails.material_url, 'material')}>
                    Ver material didáctico
                    {clickedLinks.material && <img src={comprobadoIcon} alt="Comprobado" className="subcontents-comprobado-icon" />}
                  </a>
                  <br />
                </>
              )}
              {subcontentDetails.video_url && (
                <>
                  <a
                    className="subcontents-button-link"
                    href="#"
                    onClick={() => handleLinkClick(subcontentDetails.video_url, 'video')}
                    onMouseOver={(e) => {
                      if (!materialRealizado) {
                        e.target.setAttribute('title', 'Revise el material para acceder a este apartado');
                      } else {
                        e.target.removeAttribute('title');
                      }
                    }}
                    style={{ pointerEvents: materialRealizado ? 'auto' : 'none', opacity: materialRealizado ? 1 : 0.5 }}
                  >
                    Ver video
                    {clickedLinks.video && <img src={comprobadoIcon} alt="Comprobado" className="subcontents-comprobado-icon" />}
                  </a>
                  <br />
                </>
              )}
              {subcontentDetails.juego_url && (
                <>
                  <a
                    className="subcontents-button-link"
                    href="#"
                    onClick={() => handleLinkClick(subcontentDetails.juego_url, 'juego')}
                    onMouseOver={(e) => {
                      if (!materialRealizado || !videoRealizado) {
                        e.target.setAttribute('title', 'Revise el material y el video para acceder a este apartado');
                      } else {
                        e.target.removeAttribute('title');
                      }
                    }}
                    style={{ pointerEvents: materialRealizado && videoRealizado ? 'auto' : 'none', opacity: materialRealizado && videoRealizado ? 1 : 0.5 }}
                  >
                    Ver juego
                    {clickedLinks.juego && <img src={comprobadoIcon} alt="Comprobado" className="subcontents-comprobado-icon" />}
                  </a>
                  <br />
                </>
              )}
              <div className="navigation-buttons">
                {contentDetails && contentDetails.subcontents && contentDetails.subcontents.data.findIndex(subcontent => subcontent.id.toString() === subcontentId) > 0 && (
                  <button className="navigation-button" onClick={() => handleNavigation('prev')}>
                    Anterior
                  </button>
                )}
                {contentDetails && contentDetails.subcontents && contentDetails.subcontents.data.findIndex(subcontent => subcontent.id.toString() === subcontentId) < contentDetails.subcontents.data.length - 1 && (
                  <button className="navigation-button" onClick={() => handleNavigation('next')}>
                    Siguiente
                  </button>
                )}
              </div>
            </>
          ) : (
            <p>Cargando detalles del contenido...</p>
          )}
        </div>
        <div className="subcontents-video-container">
          {resourceUrl ? (
            <>
              <iframe
                src={resourceUrl}
                width="640"
                height="480"
                allow="autoplay"
                title="resource"
              ></iframe>
              {showMaterialRealizadoButton && (
                <button
                  className={`subcontents-buttonmaterial ${materialRealizado ? 'realizado' : ''}`}
                  onClick={() => handleContentRealizado('material')}
                  disabled={materialRealizado}
                >
                  {materialRealizado ? 'Material Realizado' : 'Marcar como Realizado'}
                </button>
              )}
              {showVideoRealizadoButton && (
                <button
                  className={`subcontents-buttonvideo ${videoRealizado ? 'realizado' : ''}`}
                  onClick={() => handleContentRealizado('video')}
                  disabled={videoRealizado}
                >
                  {videoRealizado ? 'Video Realizado' : 'Marcar como Realizado'}
                </button>
              )}
              {showJuegoRealizadoButton && (
                <button
                  className={`subcontents-buttonjuego ${juegoRealizado ? 'realizado' : ''}`}
                  onClick={() => handleContentRealizado('juego')}
                  disabled={juegoRealizado}
                >
                  {juegoRealizado ? 'Juego Realizado' : 'Marcar como Realizado'}
                </button>
              )}
            </>
          ) : (
            <p>Para este contenido, dar click en los botones.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubContentsPage;
