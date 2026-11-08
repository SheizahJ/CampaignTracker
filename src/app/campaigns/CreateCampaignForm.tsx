"use client";

import { useRef, useState } from "react";
import { createNewCampaign } from "./actions";

export function CreateCampaignForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [bannerName, setBannerName] = useState("");
  const bannerInputRef = useRef<HTMLInputElement>(null);

  async function submitCampaign(formData: FormData) {
    await createNewCampaign(formData);
    setIsOpen(false);
  }

  return (
    <>
      <button
        className="light group flex min-h-32 w-full flex-col items-start justify-between rounded-md bg-white/40 p-5 text-left outline-2 outline-dashed outline-[var(--theme-orange)] -outline-offset-4 hover:bg-white/75 hover:outline-white"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--theme-orange)] text-2xl text-white transition-colors group-hover:bg-white group-hover:text-[var(--theme-orange)]">
          +
        </span>
        <span className="font-semibold text-[var(--theme-orange)] group-hover:text-white">
          Create a campaign
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <form
            action={submitCampaign}
            className="content w-full max-w-lg rounded-md border border-black/10 p-6 shadow-xl"
          >
            <h2 className="mb-4">Create a Campaign</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block font-medium" htmlFor="campaign-title">Title *</label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  id="campaign-title"
                  name="title"
                  defaultValue="New Campaign"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium" htmlFor="campaign-subtitle">Subtitle</label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  id="campaign-subtitle"
                  name="subtitle"
                  defaultValue="A Journey's End"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium" htmlFor="campaign-description">Description</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  id="campaign-description"
                  name="description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium" htmlFor="campaign-banner">Banner image</label>
                <input
                  ref={bannerInputRef}
                  accept="image/*"
                  className="sr-only"
                  id="campaign-banner"
                  name="banner"
                  onChange={(event) =>
                    setBannerName(event.target.files?.[0]?.name ?? "")
                  }
                  type="file"
                />
                <button
                  className="rounded border border-black/20 px-2 py-0.5 text-xs"
                  onClick={() => bannerInputRef.current?.click()}
                  type="button"
                >
                  Choose file
                </button>
                <span className="ml-3 text-sm text-black/60">
                  {bannerName || "No file chosen"}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="no-bg rounded border border-black/20 px-4 py-2" onClick={() => setIsOpen(false)} type="button">
                Cancel
              </button>
              <button className="rounded px-4 py-2 font-semibold text-white" type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
