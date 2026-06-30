import React, { useEffect, useRef } from "react";
import "./Hyperspeed.css";

const blue = [63, 124, 255];
const ice = [109, 231, 255];
const violet = [155, 114, 255];

function mixColor(a, b, t) {
  return a.map((value, index) => Math.round(value + (b[index] - value) * t));
}

function rgba(color, alpha) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

function Hyperspeed() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lightStreaks = [];
    let particles = [];

    const resetLight = (light, initial = false) => {
      const side = Math.random() > 0.5 ? 1 : -1;
      light.side = side;
      light.z = initial ? Math.random() : 0;
      light.x = side * (0.22 + Math.random() * 0.48);
      light.speed = 0.0045 + Math.random() * 0.011;
      light.length = 0.08 + Math.random() * 0.22;
      light.width = 1.4 + Math.random() * 3.8;
      light.color = mixColor(Math.random() > 0.5 ? blue : ice, violet, Math.random() * 0.35);
    };

    const createScene = () => {
      const lightCount = Math.min(120, Math.max(62, Math.floor(width / 18)));
      lightStreaks = Array.from({ length: lightCount }, () => {
        const light = {};
        resetLight(light, true);
        return light;
      });

      particles = Array.from({ length: 90 }, () => ({
        x: Math.random(),
        y: Math.random(),
        speed: 0.0008 + Math.random() * 0.002,
        size: 0.6 + Math.random() * 1.6,
        alpha: 0.12 + Math.random() * 0.32,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createScene();
    };

    const project = (x, z) => {
      const depth = Math.max(0.001, z);
      const scale = 1 / (depth * 1.9 + 0.08);
      const horizon = height * 0.43;
      return {
        x: width * 0.55 + x * width * 0.22 * scale,
        y: horizon + height * 0.52 * scale,
        scale,
      };
    };

    const drawRoad = (time) => {
      const horizon = height * 0.43;
      const bottom = height * 1.05;
      const roadGradient = ctx.createLinearGradient(0, horizon, 0, bottom);
      roadGradient.addColorStop(0, "rgba(2, 5, 11, 0.02)");
      roadGradient.addColorStop(0.42, "rgba(6, 13, 32, 0.2)");
      roadGradient.addColorStop(1, "rgba(3, 8, 20, 0.82)");

      ctx.beginPath();
      ctx.moveTo(width * 0.46, horizon);
      ctx.lineTo(width * 0.14, bottom);
      ctx.lineTo(width * 0.92, bottom);
      ctx.lineTo(width * 0.62, horizon);
      ctx.closePath();
      ctx.fillStyle = roadGradient;
      ctx.fill();

      const laneColor = rgba(ice, 0.22);
      const edgeColor = rgba(blue, 0.38);
      for (const laneX of [-0.52, -0.18, 0.18, 0.52]) {
        ctx.beginPath();
        for (let z = 1; z > 0.02; z -= 0.025) {
          const p = project(laneX, z);
          if (z === 1) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = Math.abs(laneX) > 0.5 ? edgeColor : laneColor;
        ctx.lineWidth = Math.abs(laneX) > 0.5 ? 1.5 : 0.7;
        ctx.stroke();
      }

      for (let i = 0; i < 18; i += 1) {
        const z = ((i / 18 + time * 0.00012) % 1) || 0.01;
        const p1 = project(-0.18, z);
        const p2 = project(-0.18, Math.max(0.01, z - 0.032));
        const p3 = project(0.18, z);
        const p4 = project(0.18, Math.max(0.01, z - 0.032));
        ctx.strokeStyle = rgba(ice, Math.min(0.32, p1.scale * 0.018));
        ctx.lineWidth = Math.max(0.5, p1.scale * 0.02);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }
    };

    const drawLightStreaks = () => {
      lightStreaks.forEach((light) => {
        light.z += light.speed;
        if (light.z > 1.12) resetLight(light);

        const start = project(light.x, light.z);
        const end = project(light.x, Math.max(0.01, light.z - light.length));
        const alpha = Math.min(0.98, start.scale * 0.045);

        const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        gradient.addColorStop(0, rgba(light.color, 0));
        gradient.addColorStop(0.45, rgba(light.color, alpha * 0.5));
        gradient.addColorStop(1, rgba(light.color, alpha));
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(1, light.width * start.scale * 0.025);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      });
    };

    const drawParticles = () => {
      particles.forEach((particle) => {
        particle.y += particle.speed;
        particle.x += particle.speed * 0.28;
        if (particle.y > 1.05 || particle.x > 1.05) {
          particle.x = Math.random() * 0.7;
          particle.y = -0.05;
        }
        ctx.fillStyle = rgba(particle.x > 0.55 ? blue : ice, particle.alpha);
        ctx.beginPath();
        ctx.arc(particle.x * width, particle.y * height, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "rgba(1, 3, 12, 0.92)");
      bg.addColorStop(0.48, "rgba(4, 12, 35, 0.64)");
      bg.addColorStop(1, "rgba(0, 2, 9, 0.96)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      drawParticles();
      drawRoad(time);
      drawLightStreaks();

      const vignette = ctx.createRadialGradient(width * 0.58, height * 0.44, 0, width * 0.58, height * 0.44, width * 0.72);
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(0.66, "rgba(0, 0, 0, 0.2)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.76)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    animationFrame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas className="hyperspeed-canvas" ref={canvasRef} aria-hidden="true" />;
}

export default Hyperspeed;
