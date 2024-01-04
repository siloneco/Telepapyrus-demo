export const listTagsSQL = `
SELECT tag FROM allowed_tags WHERE user = ?;
`
