import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#204d9c] text-white mt-20 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section 1 */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">เกี่ยวกับเรา</h2>
            <p>
              บริษัทของเรามุ่งมั่นที่จะให้บริการที่ดีที่สุดและผลิตภัณฑ์คุณภาพสูงสุดแก่ลูกค้าของเรา
              เรามีความภูมิใจในความเชี่ยวชาญและประสบการณ์ของเราในอุตสาหกรรมนี้
            </p>
          </div>
          {/* Section 2 */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">ผลิตภัณฑ์</h2>
            <ul>
              <li>
                <Link href="/category/packaging" className="hover:underline">
                  บรรจุภัณฑ์เฟสท์
                </Link>
              </li>
              <li>
                <Link href="/category/office-supplies" className="hover:underline">
                  อุปกรณ์สำนักงาน
                </Link>
              </li>
              <li>
                <Link href="/category/cleaning-products" className="hover:underline">
                  ผลิตภัณฑ์ทำความสะอาด
                </Link>
              </li>
            </ul>
          </div>
          {/* Section 3 */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">ติดต่อเรา</h2>
            <ul>
              <li>
                บริษัท ยูไนเต็ด1999 พลัซ จำกัด 1 ซ.ข้างอำเภอ ถ.ตากสินมหาราช
                ต.เชิงเนิน อ.เมือง จ.ระยอง 21000
              </li>
              <li>
                โทร:{" "}
                <a className="hover:underline" href="tel:038-623-126">
                  038-623126
                </a>
              </li>
              <li>
                Fax:{" "}
                <a className="hover:underline" href="tel:038-623-433">
                  (038)623433
                </a>
              </li>
              <li>
                อีเมล:{" "}
                <a
                  href="mailto:united.sale.ry@gmail.com"
                  className="hover:underline"
                >
                  united.sale.ry@gmail.com
                </a>
              </li>
              <li>
                ที่ตั้ง:{" "}
                <Link
                  target="_blank"
                  className="hover:underline"
                  href="https://maps.app.goo.gl/3Csiyy9qcEXeckLM8"
                >
                  บริษัท ยูไนเต็ด1999 พลัซ จำกัด
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p>© 2024 บริษัทยูไนเต็ด1999พลัซ สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
