

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