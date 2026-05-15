export default function LocationSection() {

  return (

    <section className="location-section">

      <div className="location-info">

        <h2>
          Ubicación
        </h2>

        <p>
          Av. Corrientes 1234
          Buenos Aires, Argentina
        </p>

        <p>
          Lunes a Viernes:
          09:00 - 20:00
        </p>

        <p>
          Sábados:
          09:00 - 18:00
        </p>

        <p>
          Domingos:
          Cerrado
        </p>

      </div>


      <a
        href="https://maps.google.com"
        target="_blank"
        rel="noreferrer"
        className="location-map"
      >

        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b"
          alt="mapa"
        />

      </a>

    </section>

  );
}