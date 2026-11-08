
"use client";

import { useState } from "react";
import type { Campaign } from "@/db/fetch_data/campaigns";
import { displayUsername } from "@/lib/displayUsername";
import { deleteExistingCampaign } from "./actions";

interface CampaignBlockProps {
    campaign: Campaign;
    currentUsername?: string;
}

export function CampaignBlock({ campaign, currentUsername }: CampaignBlockProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteTitle, setDeleteTitle] = useState("");
    const titleMatches = deleteTitle === campaign.title;
    const isCreator = campaign.creator === currentUsername;

    return (
        <div className="relative">
          <button
            className="campaign_banner light flex min-h-32 w-full items-end justify-between overflow-hidden rounded-md border border-black/10 bg-cover bg-center p-5 text-left shadow-sm hover:shadow-md"
            style={campaign.bannerImageUrl ? { backgroundImage: `url(${campaign.bannerImageUrl})` } : undefined}
            type="button"
          >
            <div className="relative z-10 flex h-full w-full flex-col items-start">
                {campaign.creator !== currentUsername && (
                    <span className="uppercase text-sm font-bold text-black/50+">
                        [DM {displayUsername(campaign.creator)}]
                    </span>
                )}
                <div className="mt-auto flex flex-col items-start">
                    <span className="title text-lg font-bold">{campaign.title}</span>
                    <span className="text-sm text-black/50">
                        {campaign.subtitle ?? "Campaign"}
                    </span>
                </div>
            </div>
          </button>
          {isCreator && (
              <form action={deleteExistingCampaign} className="absolute right-2 top-2 z-20">
                  <input type="hidden" name="campaignId" value={campaign.id} />
                  <button
                      aria-label={`Delete ${campaign.title}`}
                      className="no-bg rounded p-1"
                      onClick={() => setConfirmDelete(true)}
                      type="button"
                  >
                      <span aria-hidden="true" className="trash-icon block" />
                  </button>
              </form>
          )}
          {!isCreator && (
              <button
                  aria-label={`Leave ${campaign.title}`}
                  className="no-bg absolute right-2 top-2 z-20 rounded p-1"
                  onClick={() => setConfirmDelete(true)}
                  type="button"
              >
                  <span aria-hidden="true" className="leave-icon block" />
              </button>
          )}
          {confirmDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
                  {isCreator ? (
                    <form action={deleteExistingCampaign} className="content w-full max-w-sm rounded-md border border-black/10 p-6 shadow-xl">
                        <input type="hidden" name="campaignId" value={campaign.id} />
                        <h3 className="mb-2">Delete campaign?</h3>
                        <p className="mb-6 text-sm text-black/60">
                            This will permanently delete {campaign.title}.
                        </p>
                        <label className="mb-6 block text-sm" htmlFor={`delete-title-${campaign.id}`}>
                            Type <strong>{campaign.title}</strong> to confirm.
                            <input
                                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                                id={`delete-title-${campaign.id}`}
                                onChange={(event) => setDeleteTitle(event.target.value)}
                                value={deleteTitle}
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
                                disabled={!titleMatches}
                                type="submit"
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                  ) : (
                    <div className="content w-full max-w-sm rounded-md border border-black/10 p-6 shadow-xl">
                        <h3 className="mb-2">Leave session?</h3>
                        <p className="mb-6 text-sm text-black/60">
                            Leave {campaign.title}?
                        </p>
                        <div className="flex justify-end gap-3">
                          <button
                              className="no-bg rounded border border-black/20 px-4 py-2"
                              onClick={() => setConfirmDelete(false)}
                              type="button"
                          >
                              Cancel
                          </button>
                          <button className="rounded bg-red-700 px-4 py-2 font-semibold text-white" onClick={() => setConfirmDelete(false)} type="button">
                              Confirm
                          </button>
                      </div>
                    </div>
                  )}
              </div>
          )}
        </div>
    );
}

interface InviteBlockProps {
    campaignName: string;
    invitedBy: string;
}

export function InviteBlock({ campaignName, invitedBy }: InviteBlockProps) {
    return (
        <div className="relative overflow-hidden rounded-md border-2 border-dashed border-[var(--theme-orange)] bg-[var(--theme-orange)]/5 p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--theme-orange)] text-2xl text-white">
                        ✉
                    </span>
                    <div>
                        <h3 className="title text-xl font-semibold">{campaignName}</h3>
                        <p className="text-sm text-black/60">
                            {displayUsername(invitedBy)} invited you to join this campaign.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 sm:shrink-0">
                    <button className="rounded-md bg-[var(--theme-orange)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-95" type="button">
                        Accept
                    </button>
                    <button className="rounded-md border border-black/15 bg-white/70 px-4 py-2 text-sm font-semibold hover:bg-white" type="button">
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
}