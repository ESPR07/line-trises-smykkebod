import { useState } from "react";
import style from "./EventButton.module.css";

interface ButtonProps {
  text: string;
  event: (e: React.MouseEvent<HTMLButtonElement>) => void;
  buttonWidth: number;
  checkBox?: boolean;
}

function EventButton({ text, event, buttonWidth, checkBox = true}: ButtonProps) {
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    event(e);

    // trigger “added” animation/text
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if(!checkBox) {
    return(
      <button
      style={{ width: `${buttonWidth}%` }}
      className={`${style.eventButton}`}
      onClick={event}
    >
      {text}
    </button>
    )
  }

  return (
    <button
      style={{ width: `${buttonWidth}%` }}
      className={`${style.eventButton} ${added ? style.added : ""}`}
      onClick={handleClick}
      disabled={added}
    >
      {added ? "✔" : text}
    </button>
  );
}

export default EventButton;
