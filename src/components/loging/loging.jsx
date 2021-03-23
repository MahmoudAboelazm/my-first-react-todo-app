import Input from "../common/input";
import "../form.css";
import { Icon } from "@iconify/react";
import baselinePerson from "@iconify/icons-ic/baseline-person";
import outlineLock from "@iconify/icons-ic/outline-lock";

const Login = ({ error, handleSubmit, handleChange, user }) => {
  if (user) window.location = "/";
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <Input
          label={<Icon className="input-icon" icon={baselinePerson} />}
          name="username"
          onChange={handleChange}
          error={error.username}
        />
        <Input
          label={<Icon className="input-icon" icon={outlineLock} />}
          name="password"
          onChange={handleChange}
          type="password"
          error={error.password}
        />
        {error.wronguser && (
          <div className="alert alert-danger">{error.wronguser}</div>
        )}
        <button className="btn ">SIGN IN</button>
      </form>
    </div>
  );
};

export default Login;
