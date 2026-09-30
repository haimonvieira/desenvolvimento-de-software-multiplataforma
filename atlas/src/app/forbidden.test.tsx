import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Forbidden from "./forbidden";

describe("403 page", () => {
  it("explains the refusal and links the owner to the administration entry point", () => {
    const html = renderToStaticMarkup(<Forbidden />);

    expect(html).toContain("403");
    expect(html).toContain('href="/admin/entrar"');
    expect(html).toContain('href="/"');
  });
});
