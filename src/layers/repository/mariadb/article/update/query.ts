export const updateArticleSQL = () => `
UPDATE articles SET title = ?, description = ?, content = ?, last_updated = now(3) WHERE user = ? AND id = ?;
`

export const deleteTagsSQL = () => `
DELETE FROM tags WHERE user = ? and id = ?;
`

export const insertTagsSQL = () => `
INSERT INTO tags (user, id, tag) VALUES ?;
`
