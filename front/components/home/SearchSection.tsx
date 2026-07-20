export default function SearchSection() {

  return (
    <section className="search-section">

      <h2>
        ¿Qué servicio estás buscando?
      </h2>

      <div className="search-box">

        <input
          type="text"
          placeholder="Buscar corte, barba, color..."
          className="search-input"
        />

        <button className="search-btn">
          Buscar
        </button>

      </div>

    </section>
  );
}