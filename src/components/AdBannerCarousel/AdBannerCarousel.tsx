import { useEffect, useRef, useState } from "react";
import style from "./AdBannerCarousel.module.css"
import NavigationButton from "../utils/Button/NavigationButton";

// This will be replaced by real data later
const images = [
  {
    imageurl: "/src/assets//pexels-gdtography-277628-6563393.jpg",
    imagealt: "this is a image!"
  },
  {
    imageurl: "/src/assets//pexels-gdtography-277628-6563393.jpg",
    imagealt: "this is a image!"
  }
];

function AdBannerCarousel() {
  const [scrollValue, setScrollValue] = useState<number>(0)
  const activeImage = useRef<HTMLImageElement>(null);

  useEffect(() => {
    activeImage.current?.scrollTo({left: 0});
  }, [])

  useEffect(() => {
    if(activeImage.current) {
      const activeImageElement = activeImage.current.querySelector(`#image-${scrollValue}`);
      if(activeImageElement) {
        activeImageElement.scrollIntoView({block: "center"});
      }
    }
  }, [scrollValue]);

  function fallbackImage(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const target = e.currentTarget as HTMLImageElement;
    target.src = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  }

  return(
    <div className={style.AdBannerContainer} ref={activeImage}>
      <div className={style.imageWrapper}>
        {images.map((image, index) => {
          return(
            <img key={index} id={`image-${index}`} src={image.imageurl} alt={image.imagealt} onError={fallbackImage}/>
          )
        })}
      </div>
      <ul className={style.carouselDotList}>
        {images.map((_, index) => {
          return (
            <li key={index} id={`button-${index}`} className={`${scrollValue === index? style.activeDot : ""}`} onClick={() => {setScrollValue(index)}}></li>
          )
        })}
      </ul>
      <div className={style.welcomeBox}>
        <h1>Velkommen</h1>
        <img src="/src/assets/logo_green.svg"/>
        <NavigationButton text="Oppdag" path="#" buttonWidth={100}/>
      </div>
    </div>
  )
}

export default AdBannerCarousel;