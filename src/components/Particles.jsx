import { useEffect, useRef } from "react";

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function Particles({
  quantity = 80,
  color = "#ffffff",
  className = "",
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(null);
  const circlesRef = useRef([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  const rgb = hexToRgb(color);

  const createCircle = () => ({
    x: Math.random() * sizeRef.current.w,
    y: Math.random() * sizeRef.current.h,
    r: Math.random() * 2.5 + 1,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    a: Math.random() * 0.6 + 0.3,
  });

  const resize = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!container || !canvas || !ctx) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    sizeRef.current = { w, h };

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    circlesRef.current = Array.from({ length: quantity }, createCircle);
  };

  const animate = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);

    for (const c of circlesRef.current) {
      c.x += c.vx;
      c.y += c.vy;

      if (c.x < -10) c.x = sizeRef.current.w + 10;
      if (c.x > sizeRef.current.w + 10) c.x = -10;
      if (c.y < -10) c.y = sizeRef.current.h + 10;
      if (c.y > sizeRef.current.h + 10) c.y = -10;

      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${c.a})`;
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    ctxRef.current = canvasRef.current?.getContext("2d") ?? null;
    requestAnimationFrame(() => {
    resize();
    animate();
    });

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, color]);

  return (
  <div
    ref={containerRef}
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{ width: "100%", height: "100%" }}
  >
    <canvas ref={canvasRef} className="w-full h-full" />
  </div>
    );
}