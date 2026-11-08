

export function CampaignBlock() {
    var isDM = true;
    return (
        <button
            className={(isDM ? "dm-mark" : "" ) + " light flex min-h-32 items-end justify-between overflow-hidden rounded-md border border-black/10 p-5 text-left shadow-sm hover:shadow-md"}
            type="button"
          >
            <div className="relative z-10 flex flex-col items-start justify-end">
                <span className="text-sm text-black/50">Campaign</span>
                <span className="text-lg font-semibold">New adventure</span>
            </div>
        </button>
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
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--theme-orange)]">
                            You are invited
                        </span>
                        <h2 className="text-xl font-semibold">{campaignName}</h2>
                        <p className="text-sm text-black/60">
                            {invitedBy} invited you to join this campaign.
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