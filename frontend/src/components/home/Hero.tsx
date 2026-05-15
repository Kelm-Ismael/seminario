import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {

  const navigate = useNavigate();

  const imagenes = [
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c",
    "https://images.unsplash.com/photo-1517832606299-7ae9b720a186",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1"
  ];

  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {

    const intervalo = setInterval(() => {

      setImagenActual((prev) =>
        prev === imagenes.length - 1
          ? 0
          : prev + 1
      );

    }, 3000);

    return () => clearInterval(intervalo);

  }, []);

  return (
    <section className="hero">

      <div className="hero-content">

        <p className="hero-mini">
          Peluquería & Barbería Profesional
        </p>

        <h2>
          DAVID MARTINEZ
        </h2>

        <h3>
          ESTILISTA UNISEX
        </h3>

        <p className="hero-description">

          Estilo, confianza y personalidad
          en cada corte.

          Un servicio profesional pensado
          para vos.

        </p>

        <div className="hero-buttons">

          <button
            onClick={() => navigate("/turnos")}
          >
            Reservá tu turno
          </button>

          <button className="secondary-btn">
            Ver servicios
          </button>

        </div>

      </div>

      <div className="carousel">

        <img
          src={imagenes[imagenActual]}
          alt="Barberia"
        />

      </div>

    </section>
  );
}