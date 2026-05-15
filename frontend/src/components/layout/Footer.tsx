export default function Footer() {

  return (

    <footer className="footer">

      <div className="footer-content">

        {/* LOGO */}
        <div>

          <h3>
            David Martínez
          </h3>

          <p>
            Estilo que te define.
          </p>

        </div>


        {/* ENLACES */}
        <div>

          <h4>
            Enlaces
          </h4>

          <p>Inicio</p>
          <p>Servicios</p>
          <p>Galería</p>
          <p>Contacto</p>

        </div>


        {/* INFORMACION */}
        <div>

          <h4>
            Información
          </h4>

          <p>
            11 1234 5678
          </p>

          <p>
            info@davidmartinez.com
          </p>

          <p>
            Buenos Aires, Argentina
          </p>

        </div>


        {/* REDES */}
        <div>

          <h4>
            Redes Sociales
          </h4>

          <div className="socials">

            <a href="#">
              Instagram
            </a>

            <a href="#">
              Facebook
            </a>

            <a href="#">
              WhatsApp
            </a>

            <a href="#">
              TikTok
            </a>

          </div>

        </div>

      </div>


      <p className="copyright">

        © 2026 David Martínez
        Todos los derechos reservados

      </p>

    </footer>

  );
}