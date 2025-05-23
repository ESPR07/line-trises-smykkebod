import AdBannerCarousel from "../components/AdBannerCarousel/AdBannerCarousel";
import InfoBox from "../components/InfoBox/InfoBox";
import NewProductCarousel from "../components/NewProductCarousel/NewProductCarousel";

function Homepage() {
  return (
    <main>
      <AdBannerCarousel/>
      <NewProductCarousel/>
      <InfoBox/>
    </main>
  )
}

export default Homepage;