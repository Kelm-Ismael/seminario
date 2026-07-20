
import { useEffect, useState } from "react";

export default function Carousel() {

  const imagenes = [
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c",
    "https://images.unsplash.com/photo-1517832606299-7ae9b720a186"
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
    <div className="carousel">

      <img
        src={imagenes[imagenActual]}
        alt="barberia"
      />

    </div>
  );
}