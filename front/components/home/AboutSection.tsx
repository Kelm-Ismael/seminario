export default function AboutSection() {

  return (

    <section className="about-section">

      <div className="about-text">

        <h2>
          Sobre Nosotros
        </h2>

        <p>

          Combinamos experiencia,
          técnica y pasión para brindar
          el mejor servicio.

        </p>

        <ul>

          <li>
            Atención personalizada
          </li>

          <li>
            Técnicas modernas
          </li>

          <li>
            Productos premium
          </li>

        </ul>

      </div>


      <div className="about-images">

        <img
          src="https://images.unsplash.com/photo-1512690459411-b0fd1c86b8f8"
          alt="barberia"
        />

        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70"
          alt="herramientas"
        />

      </div>

    </section>

  );
}