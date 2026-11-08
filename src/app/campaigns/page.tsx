/*
  Campaigns Page
*/

import { CampaignBlock, InviteBlock } from "./CampaignProps";
import { cookies } from "next/headers";
import {
  type Campaign,
  getCampaignsByCreator,
} from "@/db/fetch_data/campaigns";
import { CreateCampaignForm } from "./CreateCampaignForm";

export default async function Campaigns_Page() {
  const username = (await cookies()).get("username")?.value;
  const yourCampaigns = username ? await getCampaignsByCreator(username) : [];
  const pendingInvites: { id: string; campaignName: string; invitedBy: string }[] = [];
  const activeSessions: Campaign[] = [];

  return (
    <main className="mx-auto mt-8 w-full max-w-7xl px-6 md:mt-12 md:px-10">
      {pendingInvites.length > 0 && (
        <section className="content mb-6 rounded-xs border border-black/10 p-6 shadow-sm md:p-8">
          <h3 className="mb-2">NEW INVITE!</h3>
          <div className="grid gap-4">
            {pendingInvites.map((invite) => (
              <InviteBlock
                key={invite.id}
                campaignName={invite.campaignName}
                invitedBy={invite.invitedBy}
              />
            ))}
          </div>
        </section>
      )}

      <section className="content mb-1 rounded-xs border border-black/10 p-6 shadow-sm md:p-8">
        <h2 className="mb-3">Your Campaigns</h2>
        <hr className="mb-6 border-black/10" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CreateCampaignForm />

          {yourCampaigns.map((campaign) => (
            <CampaignBlock
              key={campaign.id}
              campaign={campaign}
              currentUsername={username}
            />
          ))}
        </div>
      </section>

      <section className="content rounded-xs border border-black/10 p-6 shadow-sm md:p-8">
        <h2 className="mb-3">Active Sessions</h2>
        <hr className="mb-6 border-black/10" />

        {activeSessions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeSessions.map((session) => (
              <CampaignBlock
                key={session.id}
                campaign={session}
                currentUsername={username}
              />
            ))}
          </div>
        ) : (
          <p className="text-black/50">Not participating in any sessions yet...</p>
        )}
      </section>
    </main>
  );
}
