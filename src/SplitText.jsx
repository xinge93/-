import React from "react";
import "./SplitText.css";

export default function SplitText({ text, className = "", tag: Tag = "span", delay = 40 }) {
  return (
    <Tag className={`split-text ${className}`} aria-label={text}>
      {Array.from(text).map((char, index) => (
        <span
          aria-hidden="true"
          className="split-char"
          key={`${char}-${index}`}
          style={{ "--split-delay": `${index * delay}ms` }}
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </Tag>
  );
}
