interface Props {
  schema: Record<string, unknown> | Record<string, unknown>[];
}

export default function SchemaScript({ schema }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
