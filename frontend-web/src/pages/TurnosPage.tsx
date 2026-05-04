// import {useTurnos} from "../hooks/useTurnos";

// export default function TurnosPage() {
//   const { crear } = useTurnos();

//   const manejarCrear = async () => {
//     console.log("CLICK"); // 👈 VA ACÁ
//     await crear({
//       cliente_id: 1,
//       empleado_id: 1,
//       servicio_id: 1,
//       fecha: new Date().toISOString(), // 👈 mejor formato
//     });
//   };

//   return <button onClick={manejarCrear}>Crear Turno</button>;
// }

import { useTurnos } from "../hooks/useTurnos";
import { useNavigate } from "react-router-dom";

export default function TurnosPage() {
  const { crear } = useTurnos();
  const navigate = useNavigate();

  const manejarCrear = async () => {
    try {
      await crear({
        cliente_id: 1,
        empleado_id: 1,
        servicio_id: 1,
        fecha: new Date().toISOString(),
      });

      alert("Turno creado correctamente"); // 👈 mensaje
      navigate("/"); // 👈 vuelve a Home

    } catch (error) {
      alert("Error al crear turno");
    }
  };

  return <button onClick={manejarCrear}>Crear Turno</button>;
}