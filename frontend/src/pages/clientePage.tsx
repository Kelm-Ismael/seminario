// Importamos useState desde React
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
// Importamos hook personalizado
import { useClientes } from "../hooks/useClientes";

// Componente principal
const ClientesPage = () => {

  // Estados de inputs
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  // Hook personalizado
  const { clientes, agregarCliente } = useClientes();
  const navigate = useNavigate();
  // Función submit
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    // Evita recarga
    e.preventDefault();

    // Validación simple
    if (!nombre || !email) {
      alert("Nombre y email son obligatorios");
      return;
    }

    // Crear cliente
    await agregarCliente(
      nombre,
      telefono,
      email
    );

    // Limpiar formulario
    setNombre("");
    setTelefono("");
    setEmail("");
  };

  return (

    <div className="container">

      <h1>Clientes</h1>

      {/* Formulario */}
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
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) =>
            setTelefono(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button type="submit">
          Crear Cliente
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Volver a Home
        </button>

      </form>

      <hr />

      {/* Lista */}
      <h2>Lista de clientes</h2>

      {clientes.length === 0 ? (

        <p>No hay clientes</p>

      ) : (

        <ul>

          {clientes.map((cliente: any) => (

            <li key={cliente.id}>

              <strong>{cliente.nombre}</strong>
              {" - "}
              {cliente.telefono}
              {" - "}
              {cliente.email}

            </li>

          ))}

        </ul>
      )}

    </div>
  );
};

// Exportamos componente
export default ClientesPage;