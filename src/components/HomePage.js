import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ManualModal from './ManualModal';
import './HomePage.css'; // Importa el archivo CSS
import imagen1 from '../assets/por1.png';
import imagen2 from '../assets/por2.png';
import imagen3 from '../assets/por3.png';
import mainImage from '../assets/Img2.png';

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />
      <div className="container">
        <section className="section main-section">
          <div className="column left">
            <div className="diamond-image-container">
              <img src={mainImage} alt="Main visual" className="diamond-image" />
            </div>
          </div>
          <div className="column text-column">
            <h2>Conectando el mundo, un bit a la vez</h2>
            <p>¡Bienvenidos y bienvenidas a nuestra aplicación para aprender Redes de Computadores! Aquí encontrarás todo lo que necesitas saber para dominar este fascinante campo de manera efectiva. Desde conceptos básicos hasta tecnologías avanzadas, estamos aquí para guiarte en tu viaje por el mundo de las Redes. Descubre material didáctico, videos interactivos, actividades de refuerzo, y recursos adicionales para optimizar tu aprendizaje. Con nuestra aplicación, aprender sobre Redes de Computadoras nunca ha sido tan fácil y emocionante. ¡Empieza tu aventura educativa hoy mismo!</p>
          </div>
        </section>
      </div>
      <hr className="divider" />
      <div className="container1">
        <h2 className="title1">¿Por qué funciona NetMentor?</h2>
        <section className="section second-section">
          <div className="column new-content">
            <img className="imagenes" src={imagen1} alt="Imagen 1" />
            <h3>Gamificación Interactiva</h3>
            <p>Utiliza elementos de gamificación y actividades interactivas para hacer el aprendizaje más atractivo y motivador. Lo que facilita la comprensión de conceptos complejos de Redes de una manera divertida y envolvente.</p>
          </div>
          <div className="column new-content">
            <img className="imagenes" src={imagen2} alt="Imagen 2" />
            <h3>Estructura y Progreso</h3>
            <p>Proporciona contenido educativo bien estructurado, incluyendo lecciones teóricas y tutoriales paso a paso. Además, cubre una amplia gama de temas relacionados con Redes de Computadores.</p>
          </div>
          <div className="column new-content">
            <img className="imagenes" src={imagen3} alt="Imagen 3" />
            <h3>Plataforma Integral</h3>
            <p>Su interfaz intuitiva y accesible facilita el acceso a los contenidos y la navegación por las distintas secciones del software, mejorando la experiencia de aprendizaje de los estudiantes.</p>
          </div>
        </section>
      </div>
      <ManualModal />
    </div>
  );
};

export default HomePage;
