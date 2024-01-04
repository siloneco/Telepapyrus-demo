export const insertArticleSQL = `
INSERT INTO articles (user, id, title, description, content, date) VALUES (?, ?, ?, ?, ?, now(3));
`

export const insertTagsSQL = `
INSERT INTO tags (user, id, tag) VALUES ?;
`
