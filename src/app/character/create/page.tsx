"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { createNewCharacter } from "../actions";

const stats = [
  ["str", "Strength"],
  ["dex", "Dexterity"],
  ["con", "Constitution"],
  ["int", "Intelligence"],
  ["wis", "Wisdom"],
  ["cha", "Charisma"],
] as const;

const currencies = [
  ["gold", "Gold"],
  ["silver", "Silver"],
  ["copper", "Copper"],
] as const;

const proficiencyStats = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;

export default function CreateCharacterPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setImagePreview(null);
      return;
    }

    setImagePreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }
      return URL.createObjectURL(file);
    });
  }

  return (
    <main className="mx-auto mt-8 w-full max-w-3xl px-6 md:mt-12 md:px-10">
      <section className="content rounded-xs border border-black/10 p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2>Create a Character</h2>
          <Link className="text-sm underline" href="/character">
            Back to characters
          </Link>
        </div>

        <form action={createNewCharacter} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[9rem_minmax(0,1fr)]">
            <div className="space-y-2">
              <label className="block font-medium" htmlFor="character-image">Character image</label>
              <input
                className="sr-only"
                accept="image/*"
                id="character-image"
                name="image"
                onChange={handleImageChange}
                type="file"
              />
              <label
                className="flex size-36 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-[var(--theme-orange)] bg-gray-300/0 hover:bg-gray-300/35"
                htmlFor="character-image"
              >
                {imagePreview ? (
                  <img
                    alt="Selected character"
                    className="h-full w-full object-cover"
                    src={imagePreview}
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-transparent text-3xl font-light text-[var(--theme-orange)]">
                    +
                  </span>
                )}
              </label>
              <p className="text-sm text-black/60">Optional. Images must be 5 MB or smaller.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block font-medium" htmlFor="character-name">Name *</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2" id="character-name" maxLength={40} name="name" required />
              </div>
              <div className="space-y-2">
                <label className="block font-medium" htmlFor="character-surname">Surname *</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2" id="character-surname" maxLength={40} name="surname" required />
              </div>
              <div className="space-y-2">
                <label className="block font-medium" htmlFor="character-dob">Date of birth *</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2" id="character-dob" name="dob" required type="date" />
              </div>
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="font-semibold text-[var(--theme-orange)]">Stats</legend>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map(([value, label]) => (
                <div className="space-y-2" key={value}>
                  <label className="block font-medium" htmlFor={`character-${value}`}>{label}</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2" id={`character-${value}`} name={value} defaultValue="10" required step="1" type="number" />
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-semibold text-[var(--theme-orange)]">Starting bank</legend>
            <div className="grid gap-4 sm:grid-cols-3">
              {currencies.map(([value, label]) => (
                <div className="space-y-2" key={value}>
                  <label className="block font-medium" htmlFor={`character-${value}`}>{label}</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2" id={`character-${value}`} name={value} defaultValue="0" required min="0" type="number" />
                </div>
              ))}
            </div>
          </fieldset>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block font-medium" htmlFor="character-skills">Skills</label>
              <input className="w-full rounded-md border border-gray-300 px-3 py-2" id="character-skills" name="skills" placeholder="Stealth, Persuasion" />
              <p className="text-sm text-black/60">Separate multiple skills with commas.</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Proficiencies</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {proficiencyStats.map((stat) => (
                  <div className="space-y-2" key={stat}>
                    <label className="block text-sm" htmlFor={`proficiency-${stat}`}>{stat}</label>
                    <input className="w-full rounded-md border border-gray-300 px-3 py-2" id={`proficiency-${stat}`} name={stat} placeholder="Longswords, shields" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-black/60">Separate multiple proficiencies with commas.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link className="no-bg rounded border border-black/20 px-4 py-2" href="/character">
              Cancel
            </Link>
            <button className="rounded px-4 py-2 font-semibold text-white" type="submit">
              Create character
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
