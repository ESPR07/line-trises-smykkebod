// UnderConstruction.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./UnderConstruction.module.css";
import { login } from "../API/login";

type LoginFormValues = {
  email: string;
  password: string;
};

const UnderConstruction: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const [authError, setAuthError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);

    const { error } = await login(data.email, data.password);

    if (error) {
      setAuthError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoSection}>
          <div className={styles.logo}></div>
          <div className={styles.tagline}>HÅNDLAGET SMYKKER</div>
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>Åpner snart</h1>
          <p className={styles.subtitle}>
            Nettbutikken er fortsatt under konstruksjon. Vi jobber hardt for å gi deg
            den beste butikkopplevelsen!
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✨</span>
              <span>Nye Smykker</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🎨</span>
              <span>Stilrettet Design</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🛍️</span>
              <span>Enklere Handel</span>
            </div>
          </div>

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>Har du spesiell tillatelse?</span>
            <div className={styles.dividerLine} />
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                E-post
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="din@epost.no"
                {...register("email", {
                  required: "E-post er påkrevd",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Ugyldig e-postadresse",
                  },
                })}
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className={styles.error}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Passord
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                {...register("password", {
                  required: "Passord er påkrevd",
                  minLength: {
                    value: 6,
                    message: "Passord må være minst 6 tegn",
                  },
                })}
                disabled={isSubmitting}
              />
              {errors.password && (
                <span className={styles.error}>
                  {errors.password.message}
                </span>
              )}
            </div>

            {authError && (
              <div className={styles.error}>{authError}</div>
            )}

            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logger inn..." : "Logg inn"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
