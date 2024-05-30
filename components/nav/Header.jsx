import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
const Header = () => {
  return (
    <>
      {/* Header section */}
      <header className="md:border-b md:py-1 md:px-4 hidden md:flex md:justify-end">
        <ul className="flex items-center space-y-2 md:space-y-0 md:space-x-4">
          <li className="flex items-center space-x-2">
            <Phone className="text-[#204d9c]" />
            <Link
              className="text-[#204d9c] font-bold"
              href={"tel:098-765-1234"}
            >
              038-623-126
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <Mail className="text-[#204d9c]" />
            <a
              href="mailto:dbunited1999@gmail.com"
              className="text-[#204d9c] font-bold"
            >
              united.sale.ry@gmail.com
            </a>
          </li>
          <li className="flex items-center space-x-2">
            <MapPin className="text-[#204d9c]" />
            <Link
              target="_blank"
              className="text-[#204d9c] font-bold"
              href="https://maps.app.goo.gl/3Csiyy9qcEXeckLM8"
            >
              บริษัท ยูไนเต็ด1999 พลัซ จำกัด
            </Link>
          </li>
        </ul>
      </header>
      {/* End header */}
    </>
  );
};

export default Header;
