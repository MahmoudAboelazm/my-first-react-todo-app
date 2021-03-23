const Input = ({ label, name, onChange, type, error }) => {
  return (
    <section>
      <div className="form-group">
        {label && <label>{label}</label>}
        <input
          className="form-control"
          type={type ? type : "text"}
          placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
          name={name}
          onChange={onChange}
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
    </section>
  );
};

export default Input;
