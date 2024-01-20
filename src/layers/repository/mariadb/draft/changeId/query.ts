export const getQuery = () => `
UPDATE drafts SET id = ? WHERE user = ? AND id = ?;
`
