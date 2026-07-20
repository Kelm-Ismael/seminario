
type Props = {
  title: string;
  price: string;
};

export default function ServiceCard({
  title,
  price
}: Props) {

  return (
    <div className="service-card">

      <h3>{title}</h3>

      <span>{price}</span>

    </div>
  );
}