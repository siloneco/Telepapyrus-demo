export const getDeleteDraftSQL = () => `
DELETE FROM drafts WHERE user = ? AND id = ?;
`
