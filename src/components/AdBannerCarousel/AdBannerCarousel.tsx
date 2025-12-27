import { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import style from "./AdBannerCarousel.module.css";
import NavigationButton from "../utils/Button/NavigationButton";

// This will be replaced by real data later
const images = [
  {
    imageurl: "/images/pexels-gdtography-277628-6563393.jpg",
    imagealt: "this is a image!",
  },
  {
    imageurl: "/images/pexels-gdtography-277628-6563393.jpg",
    imagealt: "this is a image!",
  },
];

function AdBannerCarousel() {
  const [scrollValue, setScrollValue] = useState<number>(0);
  const activeImage = useRef<HTMLImageElement>(null);

  useEffect(() => {
    activeImage.current?.scrollTo({ left: 0 });
  }, []);

  useEffect(() => {
    if (activeImage.current) {
      const activeImageElement = activeImage.current.querySelector(
        `#image-${scrollValue}`
      );
      if (activeImageElement) {
        activeImageElement.scrollIntoView({ block: "center" });
      }
    }
  }, [scrollValue]);

  function fallbackImage(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const target = e.currentTarget as HTMLImageElement;
    target.src =
      "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  }

  // SIMPLE SWIPE → changes scrollValue
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (scrollValue < images.length - 1) setScrollValue(scrollValue + 1);
    },
    onSwipedRight: () => {
      if (scrollValue > 0) setScrollValue(scrollValue - 1);
    },
    trackMouse: true
  });

  return (
    <>
      {/* WRAPPER GETS SWIPE — NO REF CONFLICT */}
      <div {...swipeHandlers}>
        <section className={style.AdBannerContainer} ref={activeImage}>
          <article className={style.imageWrapper}>
            {images.map((image, index) => {
              return (
                <img
                  fetchPriority="high"
                  key={index}
                  id={`image-${index}`}
                  src={image.imageurl}
                  alt={image.imagealt}
                  onError={fallbackImage}
                />
              );
            })}
          </article>

          <article className={style.welcomeBox}>
            <h1>Velkommen</h1>
            <img src="/logo_green.svg" alt="Logo" />
            <NavigationButton
              text="Oppdag"
              path="browse"
              buttonWidth={100}
            />
          </article>
        </section>
      </div>

      <ul className={style.carouselDotList}>
        {images.map((_, index) => {
          return (
            <li
              key={index}
              id={`button-${index}`}
              className={`${scrollValue === index ? style.activeDot : ""}`}
              onClick={() => {
                setScrollValue(index);
              }}
            ></li>
          );
        })}
      </ul>
    </>
  );
}

export default AdBannerCarousel;
