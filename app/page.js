import Navbar from "@/components/nav/Navbar";
import Carousel from "@/components/Carousel";
import Category from "@/components/Category";
import Packaging from "@/components/product/packaging";
import OfficeSupplies from "@/components/product/officeSupplies";
import CleaningProducts from "@/components/product/cleaningProducts";

import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <div className="shap-bg p-5">
        <main className="max-w-7xl mx-auto">
          <Carousel />
          <section>
            <Category />
          </section>
        </main>
      </div>
      <div className="max-w-7xl mx-auto p-5">
        <section>
          <Packaging />
        </section>
        <section>
          <OfficeSupplies />
        </section>
        <section>
          <CleaningProducts />
        </section>
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
