"use client";
import { useEffect, useRef, useState } from "react";
import classes from "./page.module.css";
import { Vault } from "@/components/Vault/Vault";

export default function Home({
  params: { address: vaultAddress },
}: {
  params: { address: string };
}) {
  const ws = useRef<WebSocket|null>(null)
  const isLoaded = useState(false);
  useEffect(() => {
    if(isLoaded)
    {ws.current = new WebSocket("ws://localhost:8080/subscribeVault");

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
      // Optionally, send a message to the server

      ws.current?.send(JSON.stringify({ address: '143', userType: "lp" , vaultAddress:vaultAddress}));
    };

    const wsCurrent = ws.current;
    ws.current.onmessage = (event:MessageEvent) => {
      console.log("Message from server:", JSON.parse(event.data));
    };

    ws.current.onerror = (error:Event) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };
}
    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      ws.current?.close();
    };
  }, [isLoaded]);
  return (
  
      <Vault vaultAddress={vaultAddress} />

  );
}
