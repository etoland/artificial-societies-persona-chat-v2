"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatMessage, Conversation } from "./types";

const STORAGE_KEY = "radiant.persona_conversations.v1";

function loadAll(): Record<string, Conversation> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, Conversation>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors for the take-home
  }
}

export function useConversations() {
  const [all, setAll] = useState<Record<string, Conversation>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAll(loadAll());
    setHydrated(true);
  }, []);

  const getConversation = useCallback(
    (personaId: string): Conversation | undefined => all[personaId],
    [all]
  );

  const appendMessage = useCallback((personaId: string, message: ChatMessage) => {
    setAll((prev) => {
      const existing = prev[personaId];
      const next: Conversation = existing
        ? { ...existing, messages: [...existing.messages, message], lastActive: Date.now() }
        : { personaId, messages: [message], lastActive: Date.now() };
      const updated = { ...prev, [personaId]: next };
      saveAll(updated);
      return updated;
    });
  }, []);

  const updateMessage = useCallback(
    (personaId: string, messageId: string, patch: Partial<ChatMessage>) => {
      setAll((prev) => {
        const existing = prev[personaId];
        if (!existing) return prev;
        const next: Conversation = {
          ...existing,
          messages: existing.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
        };
        const updated = { ...prev, [personaId]: next };
        saveAll(updated);
        return updated;
      });
    },
    []
  );

  const archiveConversation = useCallback((personaId: string, archived = true) => {
    setAll((prev) => {
      const existing = prev[personaId];
      if (!existing) return prev;
      const updated = { ...prev, [personaId]: { ...existing, archived } };
      saveAll(updated);
      return updated;
    });
  }, []);

  const clearConversation = useCallback((personaId: string) => {
    setAll((prev) => {
      const updated = { ...prev };
      delete updated[personaId];
      saveAll(updated);
      return updated;
    });
  }, []);

  const activeConversations = Object.values(all)
    .filter((c) => c.messages.length > 0 && !c.archived)
    .sort((a, b) => b.lastActive - a.lastActive);

  return {
    hydrated,
    activeConversations,
    getConversation,
    appendMessage,
    updateMessage,
    archiveConversation,
    clearConversation,
  };
}
