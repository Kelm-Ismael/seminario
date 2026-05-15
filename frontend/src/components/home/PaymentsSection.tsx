export default function PaymentsSection() {

  return (

    <section className="payments-section">

      <h2>
        Métodos de Pago
      </h2>

      <div className="payments-grid">


        <div className="payment-card">

          <img
            src="https://cdn-icons-png.flaticon.com/512/2489/2489756.png"
            alt="efectivo"
          />

          <p>Efectivo</p>

        </div>


        <div className="payment-card">

          <img
            src="https://logospng.org/download/mercado-pago/logo-mercado-pago-256.png"
            alt="mercado pago"
          />

          <p>Mercado Pago</p>

        </div>


        <div className="payment-card">

          <img
            src="https://cdn-icons-png.flaticon.com/512/633/633611.png"
            alt="tarjeta"
          />

          <p>Crédito / Débito</p>

        </div>


        <div className="payment-card">

          <img
            src="https://cdn-icons-png.flaticon.com/512/2489/2489756.png"
            alt="transferencia"
          />

          <p>Transferencia</p>

        </div>

      </div>

    </section>

  );
}