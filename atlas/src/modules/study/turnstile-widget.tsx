"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile, explicit rendering. The sitekey is public configuration
 * (`TURNSTILE_SITE_KEY`); the matching secret stays server-side
 * (`TURNSTILE_SECRET_KEY`) and never reaches this component.
 * Source: developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 */
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = Readonly<{
  render(container: HTMLElement, options: Readonly<Record<string, unknown>>): string;
  remove(widgetId: string): void;
}>;

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileWidgetProps = Readonly<{
  /** Public sitekey, or null when the deployment has none configured. */
  siteKey: string | null;
  onToken(token: string): void;
}>;

/**
 * Renders the real Turnstile widget and hands the token to the caller. The
 * token is single-use and expires after five minutes, so it is sent with the
 * turn rather than cached.
 *
 * When no sitekey is configured the widget cannot work, so the component says
 * so instead of offering an input the visitor could never satisfy — the
 * server-side gate fails closed, and a silent dead end would be worse.
 */
export function TurnstileWidget({ siteKey, onToken }: TurnstileWidgetProps) {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    const element = container.current;
    if (!element) return;
    let widgetId: string | null = null;
    let cancelled = false;

    const render = () => {
      const api = window.turnstile;
      if (!api || cancelled) return;
      widgetId = api.render(element, {
        sitekey: siteKey,
        callback: (token: string) => onToken(token),
        "error-callback": () => onToken(""),
        "expired-callback": () => onToken(""),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT}"]`);
      const script = existing ?? document.createElement("script");
      if (!existing) {
        script.src = TURNSTILE_SCRIPT;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", render);
      return () => {
        cancelled = true;
        script.removeEventListener("load", render);
        if (widgetId) window.turnstile?.remove(widgetId);
      };
    }

    return () => {
      cancelled = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [siteKey, onToken]);

  if (!siteKey) {
    return (
      <p className="tutor-hint" role="status">
        A verificação de primeiro uso está fechada nesta configuração: sem a chave pública do Turnstile,
        nenhum turno patrocinado novo pode ser liberado.
      </p>
    );
  }
  return <div className="tutor-turnstile" ref={container} />;
}
