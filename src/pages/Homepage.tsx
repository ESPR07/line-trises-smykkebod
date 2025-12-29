import AdBannerCarousel from "../components/AdBannerCarousel/AdBannerCarousel";
import InfoBox from "../components/InfoBox/InfoBox";
import MakeYourOwn from "../components/MakeYourOwn/MakeYourOwn";
import NewProductCarousel from "../components/NewProductCarousel/NewProductCarousel";

function Homepage() {
  return (
    <main>
      <title>Line Trises Kunstsmykker - Unike håndlagde smykker</title>
      <meta
        name="description"
        content="Velkommen til Line Trises Kunstsmykker. Oppdag nøye håndlagde smykker i sølv og edelstener - laget med omtanke, kvalitet og kreativitet."
      />
      <AdBannerCarousel />
      <NewProductCarousel />
      <MakeYourOwn />
      <InfoBox />
    </main>
  );
}

export default Homepage;
