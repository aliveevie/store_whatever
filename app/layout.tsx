// app/layout.jsx
"use client";

import "./globals.css";
import { WagmiProvider } from "wagmi";
import { filecoin, filecoinCalibration } from "wagmi/chains";
import { http, createConfig } from "@wagmi/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { Navbar } from "@/components/ui/Navbar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConfettiProvider } from "@/providers/ConfettiProvider";
import Footer from "@/components/ui/Footer";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [filecoinCalibration, filecoin],
  connectors: [],
  transports: {
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>storewhatever</title>
        <meta
          name="description"
          content="storewhatever: Store anything you want, securely and professionally. Powered by Filecoin and Synapse SDK."
        />
        <meta
          name="keywords"
          content="storewhatever, storage, decentralized, file upload, synapse-sdk, filecoin, usdfc"
        />
        <meta name="author" content="storewhatever" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ThemeProvider>
          <ConfettiProvider>
            <QueryClientProvider client={queryClient}>
              <WagmiProvider config={config}>
                <RainbowKitProvider
                  modalSize="compact"
                  initialChain={filecoinCalibration.id}
                >
                  <main className="flex flex-col min-h-screen">
                    <Navbar />
                    {children}
                  </main>
                  <Footer />
                </RainbowKitProvider>
              </WagmiProvider>
            </QueryClientProvider>
          </ConfettiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
