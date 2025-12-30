export type TrackUserEventPayload =
  | {
      event_type: "view";
      media_id: string;
      metadata: { media_ids: string[] };
    }
  | {
      event_type: "like" | "save";
      media_id: string;
      metadata: null;
    }
  | {
      event_type: "comment" | "search";
      media_id: string;
      metadata: { content: string };
    };
