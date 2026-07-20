
import { useNavigate } from "react-router-dom";

export default function BookingSection() {

  const navigate = useNavigate();

  return (
    <section className="booking-section">

      <h2>
        Reservá tu turno
      </h2>

      <button
        onClick={() => navigate("/turnos")}
      >
        Reservar
      </button>

    </section>
  );
}