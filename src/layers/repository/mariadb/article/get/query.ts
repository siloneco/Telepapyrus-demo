export const getArticleQuery = () => `
SELECT
  articles.id,
  articles.title,
  articles.description,
  articles.content,
  articles.date,
  articles.last_updated,
  tag.tag
FROM
  articles,
  (
    SELECT IFNULL(
      (
        SELECT
          GROUP_CONCAT(DISTINCT tag SEPARATOR ',') AS tag
  	    FROM tags
        WHERE
          user = ? AND
          id = ?
        GROUP BY id
      ),
      NULL
    ) AS tag
  ) AS tag
WHERE
  articles.user = ? AND
  articles.id = ?;
`
