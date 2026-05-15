export default function PaymentsSection() {

  return (

    <section className="payments-section">

      <h2>
        Métodos de Pago
      </h2>

      <div className="payments-grid">


        <div className="payment-card">

          <img
            src="/cash.png"
            alt="efectivo"
          />

          <p>
            Efectivo
          </p>

        </div>


        <div className="payment-card">

          <img
            src="/mercadopago.png"
            alt="mercado pago"
          />

          <p>
            Mercado Pago
          </p>

        </div>


        <div className="payment-card">

          <img
            src="/credit-card.png"
            alt="tarjeta"
          />

          <p>
            Crédito / Débito
          </p>

        </div>


        <div className="payment-card">

          <img
            src="/transfer.png"
            alt="transferencia"
          />

          <p>
            Transferencia
          </p>

        </div>

      </div>

    </section>

  );
}