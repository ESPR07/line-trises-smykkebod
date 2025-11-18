import AdBannerCarousel from "../components/AdBannerCarousel/AdBannerCarousel";
import InfoBox from "../components/InfoBox/InfoBox";
import MakeYourOwn from "../components/MakeYourOwn/MakeYourOwn";
import NewProductCarousel from "../components/NewProductCarousel/NewProductCarousel";

function Homepage() {
  return (
    <main>
      <AdBannerCarousel/>
      <NewProductCarousel/>
      <MakeYourOwn/>
      <InfoBox/>
    </main>
  )
}

export default Homepage;