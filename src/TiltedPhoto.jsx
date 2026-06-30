import React, { useEffect, useRef } from "react";
import "./TiltedPhoto.css";

export default function TiltedPhoto({ src, alt = "", className = "", rotateAmplitude = 12, scaleOnHover = 1 }) {
  const figureRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(
    () => () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  const setTransform = (rotateX, rotateY, scale) => {
    const figure = figureRef.current;
    if (!figure) return;
    figure.style.setProperty("--photo-rotate-x", `${rotateX.toFixed(3)}deg`);
    figure.style.setProperty("--photo-rotate-y", `${rotateY.toFixed(3)}deg`);
    figure.style.setProperty("--photo-scale", scale);
  };

  const handlePointerMove = (event) => {
    const figure = figureRef.current;
    if (!figure || event.pointerType === "touch") return;

    const rect = figure.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const rotateX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotateY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    figure.style.setProperty("--photo-glow-x", `${event.clientX - rect.left}px`);
    figure.style.setProperty("--photo-glow-y", `${event.clientY - rect.top}px`);

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => setTransform(rotateX, rotateY, scaleOnHover));
  };

  const handlePointerEnter = (event) => {
    if (event.pointerType !== "touch") handlePointerMove(event);
  };

  const handlePointerLeave = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setTransform(0, 0, 1);
  };

  return (
    <figure
      ref={figureRef}
      className={`tilted-photo ${className}`}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <img src={src} alt={alt} />
    </figure>
  );
}
