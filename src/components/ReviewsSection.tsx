import { Star } from 'lucide-react';
import {
  CLIENT_REVIEWS,
  FOUNDER_PROFILE,
  STUDIO_RATING_SUMMARY,
} from '../data/portfolio';

function FiveStars({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-1" aria-label={label}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Star
          key={index}
          className="h-4 w-4 fill-amber-500 text-amber-500"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section
      id="reviews"
      className="scroll-mt-20 border-b border-[#e6e2da] bg-[#faf9f6] py-16 sm:py-22"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 rounded-2xl border border-[#e0dbd0] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium tracking-widest text-[#524e4a] uppercase">
              Verified Client &amp; Merchant Feedback
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#111015] sm:text-3xl">
              Rated {STUDIO_RATING_SUMMARY.ratingValue} / 5.0 across client builds &amp; SaaS deployments.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#524e4a]">
              Verified ratings for{' '}
              <strong className="font-semibold text-[#111015]">
                {STUDIO_RATING_SUMMARY.productName}
              </strong>{' '}
              from e-commerce leaders, service founders, and clinic operators working with{' '}
              {FOUNDER_PROFILE.primaryName}.
            </p>
          </div>

          <div className="shrink-0 rounded-xl border border-[#e6e2da] bg-[#faf9f6] px-5 py-4 text-left sm:text-right">
            <div className="flex items-center gap-2 sm:justify-end">
              <FiveStars label={STUDIO_RATING_SUMMARY.summaryLabel} />
              <span className="font-display text-2xl font-bold text-[#111015] tabular-nums">
                {STUDIO_RATING_SUMMARY.ratingValue}
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-[#524e4a] tabular-nums">
              {STUDIO_RATING_SUMMARY.reviewCount} verified reviews · 5-star average
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {CLIENT_REVIEWS.map((review) => (
            <article
              key={review.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e0dbd0] bg-white p-6 sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <FiveStars label={`5 out of 5 stars from ${review.authorName}`} />
                  <span className="font-mono text-[11px] text-[#524e4a]">
                    {review.projectOrProduct}
                  </span>
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-[#2d2a27] sm:text-[15px]">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-[#efece5] pt-4">
                <div>
                  <p className="font-display text-sm font-bold text-[#111015]">
                    {review.authorName}
                  </p>
                  <p className="text-xs text-[#524e4a]">
                    {review.authorRole}, {review.companyName}
                  </p>
                </div>
                <time
                  dateTime={review.datePublished}
                  className="font-mono text-[11px] text-[#6d6861] tabular-nums"
                >
                  {review.datePublished}
                </time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
