import React from "react";
import Navbar from "@/components/nav/Navbar";
import Carousel from "@/components/Carousel";
import Category from "@/components/Category";
import Packaging from "@/components/product/Packaging";
import OfficeSupplies from "@/components/product/OfficeSupplies";
import CleaningProducts from "@/components/product/CleaningProducts";
import ScrollToTopButton from "@/components/ScrollToTopButton";
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
      <ScrollToTopButton />
    </>
  );
}
