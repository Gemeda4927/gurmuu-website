"use client";

import Link from "next/link";
import {
  Users,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Leenjii",
      links: [
        "Barataa",
        "Qotee Bulaa",
        "Horsiisaa",
        "Hojjataa",
        "Technology",
        "Business",
      ],
    },
    {
      title: "Kaayyoo",
      links: [
        "Dhaloota Gorsuu",
        "Oltummaa",
        "Wal-simatu",
        "Hawaasa",
        "Sirna",
        "Misooma",
      ],
    },
    {
      title: "Qabsiina",
      links: [
        "Natti Bilbilaa",
        "Email",
        "Magaalaa",
        "Facebook",
        "Twitter",
        "Office",
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Nutii Dhaabbati</h3>
                <p className="text-sm text-gray-400">Gurmuu Tola Oltummaa</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Woggaa saddeen darbaan dhaloota kana keessatti baroota 2014 hanga
              ammatti kaayyoo addaa waliin oolchaa ture. Dhaloota ijjeessuu waan
              jirtan dhiifama gaafanna.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-lg mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Nutii Dhaabbati Gurmuu Tola Oltummaa.
            Hundumtuu mirga ofii isaati.
          </p>
          <p className="text-gray-500 text-xs mt-2 italic">
            "Nami maqaa isaa xureessitan dhaloota ijjeesa waan jirtanuuf dhiifama
            gaafanna"
          </p>
        </div>
      </div>
    </footer>
  );
}