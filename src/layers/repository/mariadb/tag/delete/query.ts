export const getDeleteTagSQL = () => `
DELETE FROM allowed_tags WHERE user = ? AND tag = ?;
`
