import { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import style from "./AdBannerCarousel.module.css";
import NavigationButton from "../utils/Button/NavigationButton";

// This will be replaced by real data later
const images = [
  {
    imageurl: "/images/welcomeBanner.webp",
    imagealt: "Welcome banner image",
  },
  {
    imageurl: "/images/bannerDesignYourOwn.webp",
    imagealt: "Design your own banner",
  },
];

function AdBannerCarousel() {
  const [scrollValue, setScrollValue] = useState<number>(0);
  const activeImage = useRef<HTMLImageElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    activeImage.current?.scrollTo({ left: 0 });
  }, []);

  useEffect(() => {
    if (activeImage.current) {
      const activeImageElement = activeImage.current.querySelector(
        `#image-${scrollValue}`
      ) as HTMLElement;
      if (activeImageElement) {
        activeImage.current.scrollTo({
          left: activeImageElement.offsetLeft,
          behavior: "smooth",
        });
      }
    }
  }, [scrollValue]);

  function fallbackImage(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const target = e.currentTarget as HTMLImageElement;
    target.src =
      "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  }

  const startAutoScroll = () => {
    autoScrollRef.current = setInterval(() => {
      setScrollValue((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
  };

  const resetAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    startAutoScroll();
  };

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (scrollValue < images.length - 1) {
        setScrollValue(scrollValue + 1);
        resetAutoScroll();
      }
    },
    onSwipedRight: () => {
      if (scrollValue > 0) {
        setScrollValue(scrollValue - 1);
        resetAutoScroll();
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <>
      <div {...swipeHandlers}>
        <section className={style.AdBannerContainer}>
          <article className={style.imageWrapper} ref={activeImage}>
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

          {scrollValue === 0 ? (
            <article className={style.welcomeBox}>
              <h1 className={style.welcomeBoxHeader}>Velkommen</h1>
              <img src="/logo_green.svg" alt="Logo" />
              <NavigationButton text="Oppdag" path="browse" buttonWidth={100} />
            </article>
          ) : (
            <article className={style.welcomeBox}>
              <h1>Design din egen</h1>
              <NavigationButton
                text="Design Nå"
                path="lag-din-egen"
                buttonWidth={100}
              />
            </article>
          )}
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
                resetAutoScroll();
              }}
            ></li>
          );
        })}
      </ul>
    </>
  );
}

export default AdBannerCarousel;
