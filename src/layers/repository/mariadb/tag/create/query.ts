export const insertTagSQL = `
INSERT INTO allowed_tags (user, tag) VALUES (?, ?);
`
