import client from "../api/client";

export const fetchTitleDetail = async ({ type, title, externalId }) => {
  const { data } = await client.get("/titles/detail", {
    params: { type, title, externalId: externalId || undefined },
  });
  return data.data;
};
