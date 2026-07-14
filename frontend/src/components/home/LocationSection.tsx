export default function LocationSection() {

  return (

    <section className="location-section">

      <div className="location-info">

        <h2>
          Ubicación
        </h2>

        <p>
          Av. Lopez y Planes 3072,
          Posadas - Misiones, Argentina
        </p>

        <p>
          Lunes a Viernes:
          09:00 - 21:00
        </p>

        <p>
          Sábados:
          09:00 - 21:00
        </p>

        <p>
          Domingos:
          Cerrado
        </p>

      </div>


      <a
        href="https://maps.app.goo.gl/zCRQFw6q2PJSby7F9"
        target="_blank"
        rel="noreferrer"
        className="location-map"
      >

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d372.42043846859207!2d-55.90808840734604!3d-27.373208072130836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9457bf928031641b%3A0xcf967f8a9bbfa613!2sDavid%20Mart%C3%ADnez-Estilista%20Unisex!5e0!3m2!1ses-419!2sar!4v1778883672086!5m2!1ses-419!2sar"
          width="400"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de ubicación"
        />

      </a>

    </section>

  );
}