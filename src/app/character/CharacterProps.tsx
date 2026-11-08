"use client";

import { useState } from "react";
import type { Character } from "@/db/fetch_data/characters";
import { deleteExistingCharacter } from "./actions";

interface CharacterBlockProps {
  character: Character;
}

export function CharacterBlock({ character }: CharacterBlockProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteName, setDeleteName] = useState("");
  const nameMatches =
    deleteName === `${character.name} ${character.surname}`;

  return (
    <div className="relative">
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
        <span         className="character_icon_frame order-first relative z-10 size-20 shrink-0 overflow-hidden rounded-[12px]">
          <img
            alt=""
            className="size-full rounded-[9px] bg-[var(--theme-light-orange)] object-cover"
            src={character.imageUrl}
          />
        </span>
      ) : (
        <span
          aria-label="Default character icon"
          className="character_icon_frame order-first relative z-10 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-[12px]"
          role="img"
        >
          <span className="relative size-full rounded-[9px] bg-[var(--theme-light-orange)]" aria-hidden="true">
            <span className="default_character_icon absolute inset-0 rounded-[9px]" />
          </span>
        </span>
      )}
      </button>
      <form action={deleteExistingCharacter} className="absolute right-2 top-2 z-20">
        <input type="hidden" name="characterId" value={character.id} />
        <button
          aria-label={`Delete ${character.name} ${character.surname}`}
          className="no-bg rounded p-1"
          onClick={() => setConfirmDelete(true)}
          type="button"
        >
          <span aria-hidden="true" className="trash-icon block" />
        </button>
      </form>
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <form
            action={deleteExistingCharacter}
            className="content w-full max-w-sm rounded-md border border-black/10 p-6 shadow-xl"
          >
            <input type="hidden" name="characterId" value={character.id} />
            <h3 className="mb-2">Delete character?</h3>
            <p className="mb-6 text-sm text-black/60">
              This will permanently delete {character.name} {character.surname}.
            </p>
            <label className="mb-6 block text-sm" htmlFor={`delete-character-${character.id}`}>
              Type <strong>{character.name} {character.surname}</strong> to confirm.
              <input
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                id={`delete-character-${character.id}`}
                onChange={(event) => setDeleteName(event.target.value)}
                value={deleteName}
              />
            </label>
            <div className="flex justify-end gap-3">
              <button
                className="no-bg rounded border border-black/20 px-4 py-2"
                onClick={() => setConfirmDelete(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded bg-red-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!nameMatches}
                type="submit"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
