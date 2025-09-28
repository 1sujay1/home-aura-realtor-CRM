export async function fetchLead(leadId, PAGE_ACCESS_TOKEN) {
  console.log("Fetching lead with ID:", leadId);
  console.log("Using PAGE_ACCESS_TOKEN:", PAGE_ACCESS_TOKEN);
  const response = await fetch(
    `https://graph.facebook.com/v20.0/${leadId}?access_token=${PAGE_ACCESS_TOKEN}`
  );
  return response.json();
}
