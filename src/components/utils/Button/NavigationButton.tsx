import { useNavigate } from "react-router"
import style from "./NavigationButton.module.css"

interface ButtonProps {
  text: string,
  path: string,
  buttonWidth: number
}

function NavigationButton({text, path, buttonWidth}: ButtonProps) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(path);
  }
  return(
    <button style={{width: `${buttonWidth}%`}} className={style.navigationButton} onClick={handleClick}>{text}</button>
  )
}

export default NavigationButton;