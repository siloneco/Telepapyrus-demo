export const countAllQuery = `
SELECT
  COUNT(*) AS count
FROM articles
WHERE user = ?;
`

export const countWithTagsQuery = `
SELECT
  COUNT(*) AS count
FROM (
  SELECT
	  id
	FROM tags
    WHERE
      user = ? AND
      tag IN (?)
    GROUP BY id
    HAVING COUNT(DISTINCT tag) = ?
  ) AS a;
`
