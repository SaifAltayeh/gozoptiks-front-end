type Props = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ id, label, error, children }: Props) {
  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
