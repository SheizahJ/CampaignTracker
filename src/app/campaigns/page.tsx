/*
  Campaigns Page
*/

import { CampaignBlock, InviteBlock } from "./CampaignProps";

export default async function Campaigns_Page() {
  const pendingInvites: { id: string; campaignName: string; invitedBy: string }[] =
    [
      {
        id: "demo-invite",
        campaignName: "The Lost Mine",
        invitedBy: "Dungeon Master",
      },
    ];

  return (
    <main className="mx-auto mt-20 w-full max-w-7xl px-6 md:mt-24 md:px-10">
      {pendingInvites.length > 0 && (
        <section className="content mb-6 rounded-xs border border-black/10 p-6 shadow-sm md:p-8">
          <h1 className="mb-3">Pending Invites...</h1>
          <hr className="mb-6 border-black/10" />

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

      <section className="content mb-6 rounded-xs border border-black/10 p-6 shadow-sm md:p-8">
        <h1 className="mb-3">Your Campaigns</h1>
        <hr className="mb-6 border-black/10" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            className="light group flex min-h-32 flex-col items-start justify-between rounded-md bg-white/40 p-5 text-left outline-2 outline-dashed outline-[var(--theme-orange)] -outline-offset-4 hover:bg-white/75 hover:outline-white"
            type="button"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--theme-orange)] text-2xl text-white transition-colors group-hover:bg-white group-hover:text-[var(--theme-orange)]">
              +
            </span>
            <span className="font-semibold text-[var(--theme-orange)] group-hover:text-white">
              Create a campaign
            </span>
          </button>

          <CampaignBlock/>
        </div>
      </section>

      <section className="content rounded-xs border border-black/10 p-6 shadow-sm md:p-8">
        <h1 className="mb-3">Participating In</h1>
        <hr className="mb-6 border-black/10" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CampaignBlock />
        </div>
      </section>
    </main>
  );
}
