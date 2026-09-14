type Props = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Renders JSON-LD structured data for SEO. */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
