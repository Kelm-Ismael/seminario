// Importamos useState
import { useState } from "react";

// Importamos navigate
import { useNavigate } from "react-router-dom";

// Importamos hook de turnos
import { useTurnos } from "../hooks/useTurnos";


// Componente principal
const TurnosPage = () => {

  // estados del formulario
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  // guardamos id del servicio
  const [servicio, setServicio] = useState("1");

  // hook personalizado
  const { turnos, crear } = useTurnos();

  // navigate
  const navigate = useNavigate();


  // submit formulario
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    // evitar recarga
    e.preventDefault();

    // validación
    if (!fecha || !hora) {

      alert("Fecha y hora obligatorias");

      return;
    }

    // crear turno

    await crear({

      cliente_id: 1,

      empleado_id: 1,

      servicio_id: Number(servicio),

      fecha: `${fecha} ${hora}`,

      estado: "pendiente"

    });

    // limpiar formulario
    setFecha("");
    setHora("");
    setServicio("1");
  };


  return (

    <div className="container">

      <h1>Turnos</h1>

      {/* formulario */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px"
        }}
      >

        <input
          type="date"
          value={fecha}
          onChange={(e) =>
            setFecha(e.target.value)
          }
        />

        <input
          type="time"
          value={hora}
          onChange={(e) =>
            setHora(e.target.value)
          }
        />

        {/* selector de servicios */}
        <select
          value={servicio}
          onChange={(e) =>
            setServicio(e.target.value)
          }
        >

          <option value="1">
            Corte unisex
          </option>

          <option value="2">
            Barba
          </option>

          <option value="3">
            Tintura
          </option>

        </select>

        <button type="submit"
        onClick={() => window.location.reload()}
        >
          Crear Turno
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Volver a Home
        </button>

      </form>

      <hr />

      {/* lista */}
      <h2>Lista de turnos</h2>

      {turnos.length === 0 ? (

        <p>No hay turnos</p>

      ) : (

        <ul>

          {turnos.map((turno: any) => (

            <li key={turno.id_turnos}>

              <strong>
                {new Date(turno.fecha).toLocaleString()}
              </strong>

              {" - "}

              {turno.servicio_nombre}

              {" - "}

              {turno.estado}

            </li>

          ))}

        </ul>
      )}

    </div>
  );
};

// exportamos componente
export default TurnosPage;