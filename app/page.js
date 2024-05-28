import Navbar from "@/components/nav/Navbar";
import Carousel from "@/components/Carousel";
import Category from "@/components/Category";
import Recomend from "@/components/product/Recomend";
import BestSeller from "@/components/product/BestSeller";
import Content from "@/components/Content";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <div className="shap-bg p-5 ">
        <main className="max-w-7xl mx-auto  ">
          <Carousel />
          <section>
            <Category />
          </section>
        </main>
      </div>
      <div className="max-w-7xl mx-auto">
        <section>
          <Recomend />
        </section>
        <section>
          <BestSeller />
        </section>
        <section>
          <Content />
        </section>
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
