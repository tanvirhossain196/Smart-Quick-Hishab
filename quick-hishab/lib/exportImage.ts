import { toPng } from "html-to-image";

export async function exportImage(node: HTMLElement) {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: "#EAF3EC",
  });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `Quick Hishab-report-${Date.now()}.png`;
  a.click();
}
