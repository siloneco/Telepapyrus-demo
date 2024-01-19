export const listAllQuery = `
SELECT
  id,
  title
FROM
  drafts
WHERE user = ?;
`

export const listAllWithPageQuery = `
SELECT
  id,
  title
FROM
  drafts
WHERE user = ?
ORDER BY id ASC LIMIT 10 OFFSET ?;
`
