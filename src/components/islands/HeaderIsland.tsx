import React from "react";
import { Header } from "@/components/organisms/Header";

/**
 * Isla mínima para controlar hidratación del Header.
 * NO envuelve un AuthProvider aquí (provider debe existir arriba
 * o la isla unificada lo incluirá). Esto evita múltiples providers.
 */
export function HeaderIsland(props: { className?: string }) {
  return <Header className={props.className} />;
}