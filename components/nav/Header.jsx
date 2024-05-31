import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const Header = () => {
  return (
    <>
      {/* Header section */}
      <header id="header" className="bg-gray-100 p-2 md:p-4 hidden md:flex">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-end">
          <ul className="w-full md:w-auto flex flex-col md:flex-row items-center justify-end space-y-2 md:space-y-0 md:space-x-4">
            <li className="flex items-center space-x-2">
              <Phone className="text-[#204d9c]" />
              <Link className="text-[#204d9c] font-bold" href={"tel:038-623-126"}>
                038-623-126
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="text-[#204d9c]" />
              <a href="mailto:united.sale.ry@gmail.com" className="text-[#204d9c] font-bold">
                united.sale.ry@gmail.com
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="text-[#204d9c]" />
              <Link target="_blank" className="text-[#204d9c] font-bold" href="https://maps.app.goo.gl/3Csiyy9qcEXeckLM8">
                บริษัท ยูไนเต็ด1999 พลัซ จำกัด
              </Link>
            </li>
          </ul>
        </div>
      </header>
      {/* End header */}
    </>
  );
};

export default Header;
