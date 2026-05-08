export default function DownloadCTA() {
  return (
    <section className="bg-eucalyptus border-t border-eucalyptus-deep">
      <div className="mx-auto max-w-6xl px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-display italic text-[36px] leading-[1.1] text-white">
            Ready when you are.
          </h2>
          <p className="text-[17px] leading-[1.6] text-white/80 mt-4 max-w-md">
            Download HormonaIQ and start turning what you feel into what your doctor needs to see.
          </p>
          <p className="text-[13px] text-white/60 mt-3">
            Free to download · Available on iOS and Android
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
          {/* TODO: fill real App Store URL before deploy */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download HormonaIQ on the App Store"
            className="inline-flex h-[56px] items-center gap-3 rounded-[14px] bg-white/10 border border-white/20 px-6 hover:bg-white/20 transition-colors"
          >
            <span aria-hidden="true" className="text-white text-[22px]">
              ⬇
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] text-white/70 uppercase tracking-wide">
                Download on
              </span>
              <span className="text-[16px] font-semibold text-white">App Store</span>
            </span>
          </a>

          {/* TODO: fill real Google Play URL before deploy */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download HormonaIQ on Google Play"
            className="inline-flex h-[56px] items-center gap-3 rounded-[14px] bg-white/10 border border-white/20 px-6 hover:bg-white/20 transition-colors"
          >
            <span aria-hidden="true" className="text-white text-[22px]">
              ⬇
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] text-white/70 uppercase tracking-wide">
                Get it on
              </span>
              <span className="text-[16px] font-semibold text-white">Google Play</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
