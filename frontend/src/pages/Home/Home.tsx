import { useNavigate } from "react-router-dom";
import "../../App.css";


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="App-header">
      <h1>Hola Bienvenido a mi pagina web de seminario 2026</h1>
      <button onClick={() => navigate("/turnos")}>
        Ir a Turnos
      </button>
      <button onClick={() => navigate("/clientes")}>
        Ir a Clientes
      </button>
    </div>
  );
}

