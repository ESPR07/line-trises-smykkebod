import style from "./EventButton.module.css";

interface ButtonProps {
  text: string;
  event: (e: React.MouseEvent<HTMLButtonElement>) => void;
  buttonWidth: number;
}

function EventButton({ text, event, buttonWidth }: ButtonProps) {
  return (
    <button
      style={{ width: `${buttonWidth}%` }}
      className={style.eventButton}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        event(e);
      }}
    >
      {text}
    </button>
  );
}

export default EventButton;
