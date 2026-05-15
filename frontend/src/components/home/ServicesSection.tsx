export default function ServicesSection() {

  return (

    <section className="services-section">

      <h2>
        Nuestros Servicios
      </h2>

      <div className="services-grid">

        {/* CARD 1 */}
        <div className="service-card">

          <img
            src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c"
            alt="corte"
          />

          <h3>
            Corte de Cabello
          </h3>

          <p>
            Estilo moderno y personalizado.
          </p>

          <span>$12.000</span>

        </div>


        {/* CARD 2 */}
        <div className="service-card">

          <img
            src="https://images.unsplash.com/photo-1517832606299-7ae9b720a186"
            alt="barba"
          />

          <h3>
            Corte + Barba
          </h3>

          <p>
            Corte completo con perfilado.
          </p>

          <span>$18.000</span>

        </div>


        {/* CARD 3 */}
        <div className="service-card">

          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1"
            alt="barba"
          />

          <h3>
            Arreglo de Barba
          </h3>

          <p>
            Diseño y perfilado profesional.
          </p>

          <span>$8.000</span>

        </div>


        {/* CARD 4 */}
        <div className="service-card">

          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f"
            alt="lavado"
          />

          <h3>
            Lavado Premium
          </h3>

          <p>
            Lavado + hidratación capilar.
          </p>

          <span>$6.000</span>

        </div>


        {/* CARD 5 */}
        <div className="service-card">

          <img
            src="https://images.unsplash.com/photo-1516979187457-637abb4f9353"
            alt="color"
          />

          <h3>
            Color Personalizado
          </h3>

          <p>
            Coloración y reflejos.
          </p>

          <span>$25.000</span>

        </div>

      </div>

    </section>

  );
}