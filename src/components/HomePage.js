import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ManualModal from './ManualModal';
import './HomePage.css'; // Importa el archivo CSS
import imagen1 from '../assets/por1.png';
import imagen2 from '../assets/por2.png';
import imagen3 from '../assets/por3.png';
import '../App';

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />
      <div className="container">
        <section className="section main-section">
          <div className="column left">
            <div className="diamond-image-container">
              <div className="diamond-image"></div>
            </div>
          </div>
          <div className="column">
            <h2>Conectando el mundo, un bit a la vez</h2>
            <p>¡Bienvenido a nuestra aplicación sobre redes de computadoras! Aquí encontrarás todo lo que necesitas saber para comprender y gestionar redes de manera eficiente. Desde conceptos básicos hasta tecnologías avanzadas, estamos aquí para guiarte en tu viaje por el mundo de las redes. Descubre información útil, consejos prácticos y herramientas útiles para optimizar el rendimiento de tus redes. ¡Con nuestra aplicación, dominar las redes de computadoras nunca ha sido tan fácil y emocionante!</p>
          </div>
        </section>
      </div>
      {/* Línea divisoria */}
      <hr className="divider" />
      <div className="container1">
        <h2 className='tittle1'>¿Por qué funciona NetMentor?</h2>
        <section className="section second-section">
          {/* Nuevos conjuntos de imágenes y texto */}
          <div className="column new-content">
            <img className="imagenes" src={imagen1} alt="Imagen 1" />
            <h3>Confianza</h3>
            <p>Aprendizaje personalizado Los estudiantes practican a su propio ritmo; primero para llenar las lagunas en su comprensión y luego acelerar su aprendizaje.</p>
          </div>
          <div className="column new-content">
            <img className="imagenes" src={imagen2} alt="Imagen 2" />
            <h3>Aprendizaje personalizado</h3>
            <p>Contenido de confianza Creado por expertos, la biblioteca de ejercicios y lecciones de NetMentor cubre matemáticas, ciencias y más. Y siempre es gratis para estudiantes y maestros.</p>
          </div>
          <div className="column new-content">
            <img className="imagenes" src={imagen3} alt="Imagen 3" />
            <h3>Herramientas</h3>
            <p>Herramientas para empoderar a los maestros Con NetMentor los maestros pueden identificar las lagunas en comprensión de sus estudiantes, crear una clase a la medida y satisfacer las necesidades de cada uno.</p>
          </div>
        </section>
      </div>
      <ManualModal />
    </div>
  );
};

export default HomePage;
