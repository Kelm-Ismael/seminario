// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "../../App.css";

// import Navbar from "../../components/layout/Navbar";
// import Hero from "../../components/home/Hero";
// import Features from "../../components/home/Features";
// import ServicesSection from "../../components/home/ServicesSection";
// import AboutSection from "../../components/home/AboutSection";
// import Testimonials from "../../components/home/Testimonials";
// import BookingSection from "../../components/home/BookingSection";
// import Footer from "../../components/layout/Footer";

// export default function Home() {

//   return (
//     <div className="home-container">

//       <Navbar />

//       <Hero />

//       <Features />

//       <ServicesSection />

//       <AboutSection />

//       <Testimonials />

//       <BookingSection />

//       <Footer />

//     </div>
//   );
// }

import "../../App.css";

import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import SearchSection from "../../components/home/SearchSection";
import Features from "../../components/home/Features";
import ServicesSection from "../../components/home/ServicesSection";
import StatsSection from "../../components/home/StatsSection";
import PromoSection from "../../components/home/PromoSection";
import AboutSection from "../../components/home/AboutSection";
import LocationSection from "../../components/home/LocationSection";
import PaymentsSection from "../../components/home/PaymentsSection";
import BookingSection from "../../components/home/BookingSection";
import Footer from "../../components/layout/Footer";
import WhatsappButton from "../../components/common/WhatsappButton";

export default function Home() {

  return (
    <div className="home-container">

      <Navbar />

      <Hero />

      <SearchSection />

      <Features />

      <ServicesSection />

      <StatsSection />

      <PromoSection />

      <AboutSection />

      <LocationSection />

      <PaymentsSection />

      <BookingSection />

      <Footer />

      <WhatsappButton />

    </div>
  );
}



// export default function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="App-header">
//       <h1>Hola Bienvenido a mi pagina web de seminario 2026</h1>
//       <button onClick={() => navigate("/turnos")}>
//         Ir a Turnos
//       </button>
//       <button onClick={() => navigate("/clientes")}>
//         Ir a Clientes
//       </button>
//     </div>
//   );
// }


// export default function Home() {

//   const navigate = useNavigate();


//   // =========================================
//   // CARRUSEL
//   // =========================================

//   const imagenes = [

//     "https://images.unsplash.com/photo-1622286342621-4bd786c2447c",

//     "https://images.unsplash.com/photo-1517832606299-7ae9b720a186",

//     "https://images.unsplash.com/photo-1503951914875-452162b0f3f1"
//   ];


//   const [imagenActual, setImagenActual] = useState(0);


//   useEffect(() => {

//     const intervalo = setInterval(() => {

//       setImagenActual((prev) =>
//         prev === imagenes.length - 1
//           ? 0
//           : prev + 1
//       );

//     }, 3000);

//     return () => clearInterval(intervalo);

//   }, []);


//   // =========================================
//   // RETURN
//   // =========================================

//   return (

//     <div className="home-container">


//       {/* =====================================
//           NAVBAR
//       ===================================== */}
//       <nav className="navbar">

//         {/* LOGO */}
//         <div className="logo-container">

//           <img
//             src="/logo.png"
//             alt="David Martinez"
//             className="logo-img"
//           />

//           <div>

//             <h1 className="logo-title">
//               David Martinez
//             </h1>

//             <p className="logo-subtitle">
//               Estilista Unisex
//             </p>

//           </div>

//         </div>


//         {/* MENÚ */}
//         <div className="nav-links">

//           <button onClick={() => navigate("/")}>
//             Inicio
//           </button>

//           <button onClick={() => navigate("/servicios")}>
//             Servicios
//           </button>

//           <button>
//             Nosotros
//           </button>

//           <button>
//             Galería
//           </button>

//           <button>
//             Precios
//           </button>

//           <button>
//             Contacto
//           </button>

//         </div>


//         {/* BOTON TURNO */}
//         <button
//           className="turno-btn"
//           onClick={() => navigate("/turnos")}
//         >
//           Reservá tu turno
//         </button>

//       </nav>


//       {/* =====================================
//           HERO
//       ===================================== */}
//       <section className="hero">


//         {/* TEXTO */}
//         <div className="hero-content">

//           <p className="hero-mini">
//             Peluquería & Barbería Profesional
//           </p>

//           <h2>
//             DAVID MARTINEZ
//           </h2>

//           <h3>
//             ESTILISTA UNISEX
//           </h3>

//           <p className="hero-description">

//             Estilo, confianza y personalidad
//             en cada corte.

//             Un servicio profesional pensado
//             para vos.

//           </p>


//           {/* BOTONES */}
//           <div className="hero-buttons">

//             <button
//               onClick={() => navigate("/turnos")}
//             >
//               Reservá tu turno
//             </button>

//             <button className="secondary-btn">
//               Ver servicios
//             </button>

//           </div>

//         </div>


//         {/* CARRUSEL */}
//         <div className="carousel">

//           <img
//             src={imagenes[imagenActual]}
//             alt="Barberia"
//           />

//         </div>

//       </section>


//       {/* =====================================
//           FEATURES
//       ===================================== */}
//       <section className="features">

//         <div className="feature-card">

//           <h3>Profesionales</h3>

//           <p>
//             Especialistas en cortes modernos y clásicos.
//           </p>

//         </div>

//         <div className="feature-card">

//           <h3>Ambiente Premium</h3>

//           <p>
//             Espacio cómodo y relajado.
//           </p>

//         </div>

//         <div className="feature-card">

//           <h3>Productos Premium</h3>

//           <p>
//             Trabajamos con primeras marcas.
//           </p>

//         </div>

//         <div className="feature-card">

//           <h3>Puntualidad</h3>

//           <p>
//             Respetamos tu tiempo.
//           </p>

//         </div>

//       </section>


//       {/* =====================================
//           SERVICIOS
//       ===================================== */}
//       <section className="services-section">

//         <h2>
//           Nuestros Servicios
//         </h2>


//         <div className="services-grid">


//           {/* CARD */}
//           <div className="service-card">

//             <img
//               src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c"
//               alt="corte"
//             />

//             <h3>
//               Corte de Cabello
//             </h3>

//             <p>
//               Estilo moderno y personalizado.
//             </p>

//             <span>$12.000</span>

//           </div>


//           <div className="service-card">

//             <img
//               src="https://images.unsplash.com/photo-1517832606299-7ae9b720a186"
//               alt="barba"
//             />

//             <h3>
//               Corte + Barba
//             </h3>

//             <p>
//               Corte completo con perfilado.
//             </p>

//             <span>$18.000</span>

//           </div>


//           <div className="service-card">

//             <img
//               src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1"
//               alt="barba"
//             />

//             <h3>
//               Arreglo de Barba
//             </h3>

//             <p>
//               Diseño y perfilado profesional.
//             </p>

//             <span>$8.000</span>

//           </div>


//           <div className="service-card">

//             <img
//               src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f"
//               alt="lavado"
//             />

//             <h3>
//               Lavado Premium
//             </h3>

//             <p>
//               Lavado + hidratación capilar.
//             </p>

//             <span>$6.000</span>

//           </div>


//           <div className="service-card">

//             <img
//               src="https://images.unsplash.com/photo-1516979187457-637abb4f9353"
//               alt="color"
//             />

//             <h3>
//               Color Personalizado
//             </h3>

//             <p>
//               Coloración y reflejos.
//             </p>

//             <span>$25.000</span>

//           </div>

//         </div>

//       </section>


//       {/* =====================================
//           SOBRE NOSOTROS
//       ===================================== */}
//       <section className="about-section">

//         <div className="about-text">

//           <h2>
//             Sobre Nosotros
//           </h2>

//           <p>

//             Combinamos experiencia,
//             técnica y pasión para brindar
//             el mejor servicio.

//           </p>

//           <ul>

//             <li>
//               Más de 10 años de experiencia
//             </li>

//             <li>
//               Atención personalizada
//             </li>

//             <li>
//               Técnicas modernas
//             </li>

//             <li>
//               Productos premium
//             </li>

//           </ul>

//           <button>
//             Conocé más
//           </button>

//         </div>


//         <div className="about-images">

//           <img
//             src="https://images.unsplash.com/photo-1512690459411-b0fd1c86b8f8"
//             alt="barberia"
//           />

//           <img
//             src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70"
//             alt="herramientas"
//           />

//         </div>

//       </section>


//       {/* =====================================
//           TESTIMONIOS
//       ===================================== */}
//       <section className="testimonials">

//         <h2>
//           Lo que dicen nuestros clientes
//         </h2>


//         <div className="testimonial-grid">


//           <div className="testimonial-card">

//             <h3>Lucas G.</h3>

//             <p>

//               Excelente atención y ambiente.
//               Siempre salgo conforme.

//             </p>

//           </div>


//           <div className="testimonial-card">

//             <h3>Martín R.</h3>

//             <p>

//               Muy profesionales y detallistas.
//               Excelente barbería.

//             </p>

//           </div>


//           <div className="testimonial-card">

//             <h3>Javier P.</h3>

//             <p>

//               Ambiente premium y gran calidad.

//             </p>

//           </div>

//         </div>

//       </section>


//       {/* =====================================
//           RESERVA
//       ===================================== */}
//       <section className="booking-section">

//         <div>

//           <h2>
//             Reservá tu turno
//           </h2>

//           <p>
//             Rápido, fácil y online.
//           </p>

//         </div>

//         <button
//           onClick={() => navigate("/turnos")}
//         >
//           Reservar ahora
//         </button>

//       </section>


//       {/* =====================================
//           FOOTER
//       ===================================== */}
//       <footer className="footer">

//         <div className="footer-content">

//           <div>

//             <h3>
//               David Martinez
//             </h3>

//             <p>
//               Estilo que te define.
//             </p>

//           </div>


//           <div>

//             <h4>Enlaces</h4>

//             <p>Inicio</p>
//             <p>Servicios</p>
//             <p>Galería</p>
//             <p>Contacto</p>

//           </div>


//           <div>

//             <h4>Información</h4>

//             <p>11 1234 5678</p>
//             <p>info@davidmartinez.com</p>
//             <p>Buenos Aires, Argentina</p>

//           </div>


//           <div>

//             <h4>Suscribite</h4>

//             <input
//               type="email"
//               placeholder="Tu email"
//               className="footer-input"
//             />

//           </div>

//         </div>


//         <p className="copyright">

//           © 2026 David Martinez Estilista Unisex

//         </p>

//       </footer>

//     </div>
//   );
// }


