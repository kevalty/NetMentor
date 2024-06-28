import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './HeaderLog';
import Sidebar from './Sidebar21';
import Alert from './Alert';
import './ClasePage.css';
import comprobadoIcon from '../assets/comprobado.png';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

const ClasePage = () => {
  const [userData, setUserData] = useState(null);
  const [contentDetails, setContentDetails] = useState(null);
  const [resourceUrl, setResourceUrl] = useState(null);
  const [activeSubcontentType, setActiveSubcontentType] = useState(null); // Estado para manejar el subcontenido activo
  const [clickedUrls, setClickedUrls] = useState({});
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visibleSubcontent, setVisibleSubcontent] = useState(null);
  const [testId, setTestId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

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
          setTestId(data.data.attributes.test.data?.id); // Correctly access nested test ID

          // Initialize the clicked URLs state
          const initialClickedUrls = {};
          data.data.attributes.subcontents.data.forEach(subcontent => {
            initialClickedUrls[subcontent.id] = {
              material: !subcontent.attributes.material_url,
              video: !subcontent.attributes.video_url,
              juego: !subcontent.attributes.juego_url,
              refuerzo: !subcontent.attributes.refuerzo_url
            };
          });
          setClickedUrls(initialClickedUrls);
        } else {
          console.error('Error fetching content details');
        }
      } catch (error) {
        console.error('Network error fetching content details:', error);
      }
    };

    fetchContentDetails();
  }, [contentId]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setUserData(null);
    navigate('/');
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = (url, type, subcontentId) => {
    setResourceUrl(url);
    setActiveSubcontentType(type); // Set the active subcontent type

    // Update the clicked URL state
    setClickedUrls(prevState => ({
      ...prevState,
      [subcontentId]: {
        ...prevState[subcontentId],
        [type]: true
      }
    }));
  };

  const toggleSubcontentOptions = (subcontentId) => {
    setVisibleSubcontent(visibleSubcontent === subcontentId ? null : subcontentId);
  };

  const handleTestButtonClick = () => {
    const allClicked = Object.values(clickedUrls).every(urls =>
      Object.values(urls).every(clicked => clicked)
    );

    if (allClicked) {
      if (testId) {
        navigate(`/TestContent/${contentId}/${testId}`);
      } else {
        console.error('Test ID not available');
      }
    } else {
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <div className={`clase-page-container2 ${isSidebarOpen ? 'sidebar-open2' : ''}`}>
      <Header userData={userData} handleLogout={handleLogout} />
      <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />
      <div className="content-wrapper2">
        <div className="subcontent-list2">
          <h2>{contentDetails?.name}</h2>
          {contentDetails?.subcontents?.data.map((subcontent) => (
            <div key={subcontent.id}>
              <a 
                onClick={() => toggleSubcontentOptions(subcontent.id)} 
                className={`subcontent-link2 ${visibleSubcontent === subcontent.id ? 'active' : ''}`}
              >
                {subcontent.attributes.name}
              </a>
              {visibleSubcontent === subcontent.id && (
                <ul>
                  {subcontent.attributes.material_url && (
                    <li onClick={() => handleLinkClick(subcontent.attributes.material_url, 'material', subcontent.id)}>
                      <a className={`subcontent-sublink2 ${activeSubcontentType === 'material' ? 'active' : ''}`}>Material Didactico</a>
                    </li>
                  )}
                  {subcontent.attributes.video_url && (
                    <li onClick={() => handleLinkClick(subcontent.attributes.video_url, 'video', subcontent.id)}>
                      <a className={`subcontent-sublink2 ${activeSubcontentType === 'video' ? 'active' : ''}`}>Video interactivo</a>
                    </li>
                  )}
                  {subcontent.attributes.juego_url && (
                    <li onClick={() => handleLinkClick(subcontent.attributes.juego_url, 'juego', subcontent.id)}>
                      <a className={`subcontent-sublink2 ${activeSubcontentType === 'juego' ? 'active' : ''}`}>Actividad de refuerzo</a>
                    </li>
                  )}
                  {subcontent.attributes.refuerzo_url && (
                    <li onClick={() => handleLinkClick(subcontent.attributes.refuerzo_url, 'refuerzo', subcontent.id)}>
                      <a className={`subcontent-sublink2 ${activeSubcontentType === 'refuerzo' ? 'active' : ''}`}>Material de Refuerzo</a>
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
          {testId && (
            <button
              className={`test-button2 ${Object.values(clickedUrls).every(urls => Object.values(urls).every(clicked => clicked)) ? '' : 'disabled'}`}
              onClick={handleTestButtonClick}
            >
              Tomar Examen
            </button>
          )}
        </div>
        <div className="resource-preview2">
          <div className="subcontents-video-container2">
            {resourceUrl ? (
              <div style={{ position: 'relative', width: '100%', height: 0, paddingTop: '56.25%', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)', marginTop: '1.6em', marginBottom: '0.9em' }}>
                <iframe 
                  loading="lazy" 
                  style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0 }} 
                  src={resourceUrl} 
                  allowFullScreen 
                  allow="fullscreen"
                  title="resource"
                ></iframe>
              </div>
            ) : (
              <p>Para este contenido, dar click en los botones.</p>
            )}
          </div>
        </div>
      </div>
      <Alert 
        open={alertOpen} 
        handleClose={handleCloseAlert} 
        severity="warning" 
        message="Debes revisar todos los contenidos antes de tomar el examen." 
      />
    </div>
  );
};

export default ClasePage;
