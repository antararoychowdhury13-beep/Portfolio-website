import type { Metadata } from "next";
import "../styles/global.css";
import CursorSensor from "@/components/CursorSensor";
import GenerativeMesh from "@/components/GenerativeMesh";
import GridOverlay from "@/components/GridOverlay";
import AgentStatusRail from "@/components/AgentStatusRail";
import AgentIntentOverlay from "@/components/AgentIntentOverlay";
import CalendarModal from "@/components/CalendarModal";
import PersonaBootstrap from "@/components/PersonaBootstrap";
import ChitraNarrator from "@/components/ChitraNarrator";
import ChitraNudge from "@/components/ChitraNudge";

export const metadata: Metadata = {
  title: "Anupam Sarkar — Designing where AI is the material",
  description:
    "Portfolio of Anupam Sarkar. Senior product designer building AI-native products. The interface is the agent.",
  metadataBase: new URL("https://anupam.design"),
  openGraph: {
    title: "Anupam Sarkar — AI-native product design",
    description: "The interface is the agent. Twelve years of work.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GenerativeMesh />
        <GridOverlay />
        <PersonaBootstrap />
        <ChitraNarrator />
        {children}
        <AgentStatusRail />
        <AgentIntentOverlay />
        <ChitraNudge />
        <CalendarModal />
        <CursorSensor />
      </body>
    </html>
  );
}
