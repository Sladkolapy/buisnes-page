"use client";

import { useEffect, useRef } from "react";
import Ably from "ably";

let ablyClient: Ably.Realtime | null = null;

function getAblyClient(): Ably.Realtime {
  if (!ablyClient) {
    ablyClient = new Ably.Realtime({
      authUrl: "/api/ably/token",
      authMethod: "GET",
    });
  }
  return ablyClient;
}

export function useAblyChannel(
  channelName: string,
  eventName: string,
  onMessage: (msg: Ably.Message) => void,
) {
  const handlerRef = useRef(onMessage);
  handlerRef.current = onMessage;

  useEffect(() => {
    if (!channelName) return;
    const client = getAblyClient();
    const channel = client.channels.get(channelName);
    const handler = (msg: Ably.Message) => handlerRef.current(msg);
    channel.subscribe(eventName, handler);
    return () => {
      channel.unsubscribe(eventName, handler);
    };
  }, [channelName, eventName]);
}
