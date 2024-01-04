export const insertDraftSQL = `
INSERT INTO drafts (user, id, title, content) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content);
`
