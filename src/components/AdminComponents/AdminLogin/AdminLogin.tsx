import { useState } from "react";
import EventButton from "../../utils/EventButton/EventButton";
import style from "./AdminLogin.module.css";
import { login } from "../../../API/login";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    setLoading(true);

    const { error } = await login(email, password);

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <main className={style.loginMainContainer}>
      <section className={style.loginContainer}>
        <h1>Velkommen tilbake!</h1>

        <div className={style.inputGroup}>
          <label htmlFor="email">E-post</label>
          <input
            id="email"
            type="email"
            placeholder="din@epost.no"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={style.inputGroup}>
          <label htmlFor="password">Passord</label>
          <input
            id="password"
            type="password"
            placeholder="passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p className={style.errorText}>{errorMessage}</p>}

        <EventButton
          text={loading ? "Logger inn..." : "Logg inn"}
          event={handleLogin}
          buttonWidth={50}
          checkBox={false}
        />
      </section>
    </main>
  );
}

export default AdminLogin;
