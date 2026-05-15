
type Props = {
  name: string;
  text: string;
};

export default function TestimonialCard({
  name,
  text
}: Props) {

  return (
    <div className="testimonial-card">

      <h3>{name}</h3>

      <p>{text}</p>

    </div>
  );
}