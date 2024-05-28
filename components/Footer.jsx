import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#204d9c] min-h-[15rem] text-white mt-20 py-8 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section 1 */}
          <div>
            <h2 className="text-xl font-bold mb-4">เกี่ยวกับเรา</h2>
            <p>
              บริษัทของเรามุ่งมั่นที่จะให้บริการที่ดีที่สุดและผลิตภัณฑ์คุณภาพสูงสุดแก่ลูกค้าของเรา
              เรามีความภูมิใจในความเชี่ยวชาญและประสบการณ์ของเราในอุตสาหกรรมนี้
            </p>
          </div>
          {/* Section 2 */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">ลิงก์ที่มีประโยชน์</h2>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  หน้าแรก
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  สินค้า
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  เกี่ยวกับเรา
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  ติดต่อเรา
                </a>
              </li>
            </ul>
          </div>
          {/* Section 3 */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">ติดต่อเรา</h2>
            <ul>
              <li>
                ที่อยู่: 123 ถนนตัวอย่าง ตำบลตัวอย่าง อำเภอตัวอย่าง
                จังหวัดตัวอย่าง 12345
              </li>
              <li>โทร: 123-456-7890</li>
              <li>อีเมล: example@example.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p>© 2024 บริษัทของคุณ. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
