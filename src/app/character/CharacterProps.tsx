"use client";

import { useEffect, useState } from "react";
import type { Character } from "@/db/fetch_data/characters";

interface CharacterBlockProps {
  character: Character;
}

export function CharacterBlock({ character }: CharacterBlockProps) {
  const [imageBorderColor, setImageBorderColor] = useState("var(--theme-red)");

  useEffect(() => {
    if (!character.imageUrl) {
      setImageBorderColor("var(--theme-red)");
      return;
    }

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = 1;
      canvas.height = 1;
      context.drawImage(image, 0, 0, 1, 1);
      const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
      setImageBorderColor(`rgb(${red}, ${green}, ${blue})`);
    };
    image.onerror = () => setImageBorderColor("var(--theme-red)");
    image.src = character.imageUrl;
  }, [character.imageUrl]);

  return (
    <button
      className="striped_banner light flex min-h-32 w-full items-end justify-between overflow-hidden rounded-md border border-black/10 bg-cover bg-center p-5 text-left shadow-sm hover:shadow-md"
      type="button"
    >
      <span className="relative z-10 ml-4 flex h-full min-w-0 flex-1 flex-col items-start">
        <span className="mt-auto flex flex-col items-start">
          <span className="title text-lg font-bold">
            {character.name} {character.surname}
          </span>
          <span className="text-sm text-black/50">Character</span>
        </span>
      </span>
      {character.imageUrl ? (
        <img
          alt=""
          className="order-first relative z-10 size-20 shrink-0 rounded-[12px] border-3 bg-[var(--theme-light-orange)] object-cover"
          src={character.imageUrl}
          style={{ borderColor: imageBorderColor }}
        />
      ) : (
        <span
          aria-label="Default character icon"
          className="order-first relative z-10 flex size-20 shrink-0 items-center justify-center rounded-[12px] border-3 border-[var(--theme-red)] bg-[var(--theme-light-orange)]"
          role="img"
        >
          <span className="default_character_icon size-full rounded-[12px]" aria-hidden="true" />
        </span>
      )}
    </button>
  );
}
