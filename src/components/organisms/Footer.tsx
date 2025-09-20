// src/components/organisms/Footer.tsx
import React from "react";
import { FooterNavigation } from "../molecules/FooterNavigation";
import { FooterParagraphInline } from "../molecules/FooterParagraphInline";
import { Icon } from "../atoms/Icon";

import {
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  WhatsappLogo,
} from "phosphor-react";

function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 py-8 text-sm text-gray-700">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 gap-10">
        {/* 1️⃣ Columna izquierda */}
        <div className="flex flex-col justify-between h-full gap-10">
          {/* Primer contenedor (listas) */}
          <div className="grid grid-cols-3 gap-6 h-full">
            <FooterNavigation
              title="Atención al cliente"
              items={[
                { label: "Atención al cliente", href: "#" },
                { label: "Acuerdo de servicios", href: "#" },
                { label: "Términos y condiciones", href: "#" },
                { label: "Encuesta de satisfacción", href: "#" },
              ]}
            />
            <FooterNavigation
              title="Guía de compra"
              items={[
                { label: "Crear una cuenta", href: "#" },
                { label: "Pago", href: "#" },
                { label: "Envío", href: "#" },
                { label: "Protección del comprador", href: "#" },
              ]}
            />
            <FooterNavigation
              title="Colabora con nosotros"
              items={[
                { label: "Colaboraciones", href: "#" },
                { label: "Afiliados", href: "#" },
                { label: "Dropshipping", href: "#" },
              ]}
            />
          </div>

          {/* Segundo contenedor */}
          <div className="flex flex-col gap-6">
            <FooterParagraphInline
              title="Ayuda"
              items={[
                { label: "Atención al cliente", href: "#" },
                { label: "Litigios e informes", href: "#" },
                { label: "Política de devoluciones y reembolsos", href: "#" },
                { label: "Informar de una infracción DPI", href: "#" },
                { label: "Información regulada", href: "#" },
              ]}
            />
            <FooterParagraphInline
              title="Ayuda"
              items={[
                { label: "Atención al cliente", href: "#" },
                { label: "Litigios e informes", href: "#" },
                { label: "Política de devoluciones y reembolsos", href: "#" },
                { label: "Informar de una infracción DPI", href: "#" },
                { label: "Información regulada", href: "#" },
              ]}
            />
          </div>
        </div>

        {/* 2️⃣ Columna derecha */}
        <div className="flex flex-col justify-between h-full gap-10">
          {/* Primer contenedor (pagar + iconos) */}
          <div className="flex flex-row justify-between items-start w-full">
            {/* Pagar con */}
            <div className="flex flex-col">
              <p className="font-bold mb-2">Pagar con</p>
              <div className="flex flex-row gap-2">
                <img
                  src="/images/payment.png"
                  alt="Métodos de pago"
                  className="h-6"
                />
                <img src="/images/visa.png" alt="Visa" className="h-6" />
                <img src="/images/mastercard.png" alt="Mastercard" className="h-6" />
              </div>
            </div>

            {/* Síguenos en */}
            <div className="flex flex-col">
              <p className="font-bold mb-2">Síguenos en:</p>
              <div className="flex flex-row items-center gap-4">
                <a href="#" aria-label="Facebook">
                  <Icon tamano="medium" variant="default">
                    <FacebookLogo />
                  </Icon>
                </a>
                <a href="#" aria-label="Twitter">
                  <Icon tamano="medium" variant="default">
                    <TwitterLogo />
                  </Icon>
                </a>
                <a href="#" aria-label="Instagram">
                  <Icon tamano="medium" variant="default">
                    <InstagramLogo />
                  </Icon>
                </a>
                <a href="#" aria-label="Whatsapp">
                  <Icon tamano="medium" variant="default">
                    <WhatsappLogo />
                  </Icon>
                </a>
              </div>
            </div>
          </div>

          {/* Segundo contenedor */}
          <div className="flex flex-col gap-6">
            <FooterParagraphInline
              title="Ayuda"
              items={[
                { label: "Atención al cliente", href: "#" },
                { label: "Litigios e informes", href: "#" },
                { label: "Política de devoluciones y reembolsos", href: "#" },
                { label: "Informar de una infracción DPI", href: "#" },
                { label: "Información regulada", href: "#" },
              ]}
            />
            <FooterParagraphInline
              title="Ayuda"
              items={[
                { label: "Atención al cliente", href: "#" },
                { label: "Litigios e informes", href: "#" },
                { label: "Política de devoluciones y reembolsos", href: "#" },
                { label: "Informar de una infracción DPI", href: "#" },
                { label: "Información regulada", href: "#" },
              ]}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
