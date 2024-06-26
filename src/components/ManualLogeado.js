import React from 'react';
import './Manual.css';

const ManualLogeado = () => {
  return (
    <div className="manual-container">
      <h1>Manual de Usuario - NetMentor</h1>
      
      <section>
        <h2>Página Principal</h2>
        <p>
          Después de iniciar sesión, serás dirigido a la página principal. Aquí podrás:
        </p>
        <ul>
          <li>Ver información sobre los cursos disponibles.</li>
          <li>Acceder a diferentes secciones como diagnósticos, contenidos de clase y exámenes finales.</li>
        </ul>
      </section>
      
      <section>
        <h2>Perfil</h2>
        <p>
          En la página de perfil, puedes:
        </p>
        <ul>
          <li>Ver y actualizar tu información personal.</li>
          <li>Acceder a tus calificaciones y progreso en los cursos.</li>
        </ul>
      </section>
      
      <section>
        <h2>Pruebas y Exámenes</h2>
        <p>NetMentor incluye diferentes tipos de evaluaciones:</p>
        <h3>Prueba Diagnóstico</h3>
        <ul>
          <li>Accede a la página de Prueba Diagnóstico desde el menú principal.</li>
          <li>Completa las preguntas dentro del tiempo asignado.</li>
          <li>Revisa tu calificación al final de la prueba.</li>
        </ul>
        <h3>Examen Final</h3>
        <ul>
          <li>Similar a la prueba diagnóstico, pero cubre todo el contenido del curso.</li>
          <li>Asegúrate de haber revisado todos los materiales antes de tomar el examen.</li>
        </ul>
      </section>
      
      <section>
        <h2>Contenido de Clases</h2>
        <p>
          Para acceder al contenido de las clases:
        </p>
        <ol>
          <li>Navega a la sección de contenido desde el menú.</li>
          <li>Selecciona el curso y la clase que deseas ver.</li>
          <li>Puedes acceder a materiales didácticos, videos, actividades de refuerzo y más.</li>
        </ol>
      </section>
      
      <section>
        <h2>Calificaciones</h2>
        <p>
          Para ver tus calificaciones:
        </p>
        <ol>
          <li>Ve a la sección de calificaciones desde el menú principal.</li>
          <li>Aquí podrás ver tus calificaciones para cada prueba y examen.</li>
          <li>También podrás ver un resumen de tu calificación final y progreso.</li>
        </ol>
      </section>
      

      
      <section>
        <h2>Navegación</h2>
        <p>
          La aplicación incluye una barra de navegación superior y una barra lateral para facilitar el acceso a diferentes secciones:
        </p>
        <ul>
          <li><strong>Barra de Navegación Superior:</strong> Accede a tu perfil, cerrar sesión y más.</li>
          <li><strong>Barra Lateral:</strong> Acceso rápido a contenidos de clase, calificaciones, y otras secciones importantes.</li>
        </ul>
      </section>
    </div>
  );
};

export default ManualLogeado;
