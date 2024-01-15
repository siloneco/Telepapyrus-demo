CREATE DATABASE `telepapyrus`;

CREATE TABLE `telepapyrus`.`allowed_tags` (
  `user` varchar(64) NOT NULL,
  `tag` varchar(64) NOT NULL,
  PRIMARY KEY (`user`,`tag`)
);

INSERT INTO `telepapyrus`.`allowed_tags` VALUES
("test-user", 'test-article-get-success-tag'),
("test-user", 'test-article-list-success-specific-tag'),
("test-user", "test-article-count-success-specific-tag-1"),
("test-user", "test-article-count-success-specific-tag-2"),
("test-user", "test-tag-create-fail-already-exists"),
("test-user", "test-tag-delete-fail-too-many-rows-deleted-1"),
("test-user", "test-tag-delete-fail-too-many-rows-deleted-2");

CREATE TABLE `telepapyrus`.`articles` (
  `user` varchar(64) NOT NULL,
  `id` varchar(64) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `content` text NOT NULL,
  `date` datetime(3) NOT NULL,
  `last_updated` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`user`,`id`)
);

INSERT INTO `telepapyrus`.`articles` VALUES
("test-user", 'test-article-create-fail-already-exists', 'title', 'description', 'content', '2024-01-01 00:00:00.000', NULL),
("test-user", 'test-article-delete-fail-too-many-deleted-1', 'title', 'description', 'content', '2024-01-01 00:00:00.001', NULL),
("test-user", 'test-article-delete-fail-too-many-deleted-2', 'title', 'description', 'content', '2024-01-01 00:00:00.002', NULL),
("test-user", 'test-article-get-success', 'title', 'description', 'content', '2024-01-01 00:00:00.003', '2024-01-01 00:00:00.004'),
("test-user", 'test-article-list-success-specific-tags-1', 'title', 'description', 'content', '2024-01-01 00:00:00.005', NULL),
("test-user", 'test-article-list-success-specific-tags-2', 'title', 'description', 'content', '2024-01-01 00:00:00.006', NULL),
("test-user", 'test-article-list-success-specific-tags-3', 'title', 'description', 'content', '2024-01-01 00:00:00.007', NULL),
("test-user", 'test-article-update-fail-invalid-tag', 'title', 'description', 'content', '2024-01-01 00:00:00.008', NULL),
("test-user", "test-article-count-success-specific-tags-1", "title", 'description', "content", '2024-01-01 00:00:00.009', NULL),
("test-user", "test-article-count-success-specific-tags-2", "title", 'description', "content", '2024-01-01 00:00:00.010', NULL),
("test-user", "test-article-count-success-specific-tags-3", "title", 'description', "content", '2024-01-01 00:00:00.011', NULL);

CREATE TABLE `telepapyrus`.`tags` (
  `user` varchar(64) NOT NULL,
  `id` varchar(64) NOT NULL,
  `tag` varchar(64) NOT NULL,
  PRIMARY KEY (`user`,`id`,`tag`),
  KEY `tag_idx` (`user`,`tag`),
  CONSTRAINT `id` FOREIGN KEY (`user`, `id`) REFERENCES `articles` (`user`, `id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tag` FOREIGN KEY (`user`, `tag`) REFERENCES `allowed_tags` (`user`, `tag`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `telepapyrus`.`tags` VALUES
("test-user", 'test-article-get-success', 'test-article-get-success-tag'),
("test-user", 'test-article-list-success-specific-tags-1', 'test-article-list-success-specific-tag'),
("test-user", 'test-article-list-success-specific-tags-2', 'test-article-list-success-specific-tag'),
("test-user", 'test-article-list-success-specific-tags-3', 'test-article-list-success-specific-tag'),
("test-user", "test-article-count-success-specific-tags-1", "test-article-count-success-specific-tag-1"),
("test-user", "test-article-count-success-specific-tags-2", "test-article-count-success-specific-tag-1"),
("test-user", "test-article-count-success-specific-tags-2", "test-article-count-success-specific-tag-2"),
("test-user", "test-article-count-success-specific-tags-3", "test-article-count-success-specific-tag-2");


CREATE TABLE `telepapyrus`.`drafts` (
  `user` varchar(64) NOT NULL,
  `id` varchar(64) NOT NULL,
  `title` varchar(128) DEFAULT NULL,
  `content` text DEFAULT NULL,
  PRIMARY KEY (`user`,`id`)
);

INSERT INTO `telepapyrus`.`drafts` VALUES
("test-user", "test-draft-create-success-update", "title", "content"),
("test-user", "test-draft-get-success", "title", "content"),
("test-user", "test-draft-delete-fail-too-many-deleted-1", "title", "content"),
("test-user", "test-draft-delete-fail-too-many-deleted-2", "title", "content");