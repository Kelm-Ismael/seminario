type Props = {
  placeholder: string;
};

export default function Input({
  placeholder
}: Props) {

  return (
    <input
      placeholder={placeholder}
    />
  );
}