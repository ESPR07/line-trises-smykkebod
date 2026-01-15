import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import style from "./ShippingForm.module.css";
import { shippingData } from "../../../@types/Database";

interface ShippingFormProps {
  setShippingInfo: React.Dispatch<React.SetStateAction<Partial<shippingData>>>;
  onShippingSubmit: () => Promise<void>; // called when shipping form is submitted
  disabled: boolean;
}

function ShippingForm({ setShippingInfo, onShippingSubmit, disabled }: ShippingFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<shippingData>({
    mode: "onBlur",
    defaultValues: {},
  });

  const formValues = useWatch({ control });

  // Update parent state whenever form changes
  useEffect(() => {
    setShippingInfo(formValues);
  }, [formValues, setShippingInfo]);

  const onSubmit = async () => {
    // call the parent function to create PaymentIntent
    await onShippingSubmit();
  };

  return (
    <form className={style.shippingForm} onSubmit={handleSubmit(onSubmit)}>
      <h3>Leveranse Detaljer</h3>

      {/* Email */}
      <label htmlFor="Email">E-post</label>
      <input
        className={errors.email ? style.inputError : ""}
        type="text"
        {...register("email", {
          required: "E-post mangler",
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Ugyldig E-post format" },
        })}
        id="Email"
        placeholder="f.eks ola@eksempel.no"
      />
      {errors.email && <p className={style.error}>{errors.email.message}</p>}

      {/* Phone */}
      <label htmlFor="phone">Mobilnummer</label>
      <input
        className={errors.phone ? style.inputError : ""}
        type="text"
        {...register("phone", {
          required: "Mobilnummer mangler",
          pattern: { value: /^((0047)?|(\+47)?|(47)?)\d{8}$/, message: "Kun norsk mobilnummer" },
        })}
        id="phone"
        placeholder="f.eks 123 45 678"
      />
      {errors.phone && <p className={style.error}>{errors.phone.message}</p>}

      {/* Name */}
      <div className={style.nameInputs}>
        <label htmlFor="firstName">
          Fornavn
          <input
            className={errors.firstName ? style.inputError : ""}
            type="text"
            {...register("firstName", {
              required: "Fornavn mangler",
              pattern: { value: /^[A-Za-zÆØÅæøå]+(?:[ '-][A-Za-zÆØÅæøå]+)*$/i, message: "Kun bokstaver" },
              minLength: { value: 2, message: "Minst 2 bokstaver" },
            })}
            id="firstName"
            placeholder="f.eks Ola"
          />
          {errors.firstName && <p className={style.error}>{errors.firstName.message}</p>}
        </label>

        <label htmlFor="lastName">
          Etternavn
          <input
            className={errors.lastName ? style.inputError : ""}
            type="text"
            {...register("lastName", {
              required: "Etternavn mangler",
              pattern: { value: /^[A-Za-zÆØÅæøå]+(?:[ '-][A-Za-zÆØÅæøå]+)*$/i, message: "Kun bokstaver" },
              minLength: { value: 2, message: "Minst 2 bokstaver" },
            })}
            id="lastName"
            placeholder="f.eks Nordmann"
          />
          {errors.lastName && <p className={style.error}>{errors.lastName.message}</p>}
        </label>
      </div>

      {/* Address */}
      <label htmlFor="adress">
        Adresse
        <input
          className={errors.adress ? style.inputError : ""}
          type="text"
          {...register("adress", {
            required: "Adresse mangler",
            pattern: { value: /^[A-Za-zÆØÅæøå .-]{2,}\s+[0-9]+[A-Za-z]?$/, message: "Ugyldig format" },
          })}
          id="adress"
          placeholder="f.eks Nordmannsveg 26C"
        />
        {errors.adress && <p className={style.error}>{errors.adress.message}</p>}
      </label>

      <div className={style.adressInputs}>
        <label htmlFor="sted">
          Sted
          <input
            className={errors.place ? style.inputError : ""}
            type="text"
            {...register("place", {
              required: "Sted mangler",
              pattern: { value: /^[A-Za-zÆØÅæøå]+(?:[ '-][A-Za-zÆØÅæøå]+)*$/i, message: "Kun bokstaver" },
            })}
            id="sted"
            placeholder="f.eks Oslo"
          />
          {errors.place && <p className={style.error}>{errors.place.message}</p>}
        </label>
        <label htmlFor="postNr">
          Postnr
          <input
            className={errors.postNr ? style.inputError : ""}
            type="text"
            {...register("postNr", {
              required: "PostNr mangler",
              pattern: { value: /^\d{4}$/, message: "4 tall" },
            })}
            id="postNr"
            placeholder="f.eks 1234"
          />
          {errors.postNr && <p className={style.error}>{errors.postNr.message}</p>}
        </label>
      </div>

      <button type="submit" className={style.tilBetaling} disabled={disabled}>
        Fortsett til betaling
      </button>
    </form>
  );
}

export default ShippingForm;
