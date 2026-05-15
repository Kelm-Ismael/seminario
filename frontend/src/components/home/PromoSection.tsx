export default function PromoSection() {

  return (

    <section className="promo-section">

      <h2>
        Promociones Especiales
      </h2>

      <div className="promo-grid">


        {/* PROMO 1 */}
        <div className="promo-card">

          <h3>
            Corte + Barba
          </h3>

          <p>
            20% de descuento
            lunes y martes.
          </p>

        </div>


        {/* PROMO 2 */}
        <div className="promo-card">

          <h3>
            Lavado Premium
          </h3>

          <p>
            Incluido gratis
            con corte completo.
          </p>

        </div>


        {/* PROMO 3 */}
        <div className="promo-card">

          <h3>
            Happy Hour
          </h3>

          <p>
            15% OFF
            de 14hs a 17hs.
          </p>

        </div>


        {/* PROMO 4 */}
        <div className="promo-card">

          <h3>
            Cliente Frecuente
          </h3>

          <p>
            Tu 5to corte
            con descuento especial.
          </p>

        </div>

      </div>

    </section>

  );
}