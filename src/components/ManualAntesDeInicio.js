import React from 'react';
import './Manual.css';

const ManualAntesDeInicio = () => {
  return (
    <div className="manual-container">
      <h1>Manual de Usuario - NetMentor</h1>
      
      <section>
        <h2 id="inicio-de-sesion">Inicio de Sesión</h2>
        <p>
          Para iniciar sesión en NetMentor:
        </p>
        <ol>
          <li>Abre la aplicación y dirígete a la página de inicio de sesión.</li>
          <li>Ingresa tu nombre de usuario y contraseña en los campos proporcionados.</li>
          <li>Haz clic en el botón <strong>Iniciar Sesión</strong>.</li>
          <li>Si los detalles son correctos, serás redirigido a la página principal.</li>
        </ol>
      </section>
      <section>
        <h2>Restablecer Contraseña</h2>
        <p>
          Si olvidaste tu contraseña:
        </p>
        <ol>
          <li>En la página de inicio de sesión, haz clic en <strong>¿Olvidaste tu contraseña?</strong>.</li>
          <li>Ingresa tu correo electrónico para recibir instrucciones de restablecimiento.</li>
          <li>Sigue las instrucciones del correo para crear una nueva contraseña.</li>
        </ol>
      </section>
      <section>
        <h2 id="registro">Registro</h2>
        <p>
          Para registrarte en NetMentor:
        </p>
        <ol>
          <li>Ve a la página de registro desde la pantalla de inicio.</li>
          <li>Completa el formulario de registro con la información requerida.</li>
          <li>Haz clic en <strong>Registrarse</strong>.</li>
          <li>Recibirás una confirmación por correo electrónico.</li>
        </ol>
      </section>
    </div>
  );
};

export default ManualAntesDeInicio;
