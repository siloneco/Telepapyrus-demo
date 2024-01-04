export const deleteArticleQuery = () => `
DELETE FROM articles WHERE user = ? AND id = ?;
`
