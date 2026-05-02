interface FormErrorProps {
  message: string;
}

export default function FormError({ message }: FormErrorProps) {
  return (
    <div
      role="alert"
      className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium"
    >
      {message}
    </div>
  );
}