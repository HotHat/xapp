CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `email` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户真实微信号',
  `password` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
  `thumb` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '头像',
  `last_login_at` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最后一次登录登录时间',
  `last_login_ip` bigint(11) unsigned NOT NULL DEFAULT '0' COMMENT '最后一次登录登录IP',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `admin` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `email` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户真实微信号',
  `password` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
  `thumb` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '头像',
  `last_login_at` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最后一次登录登录时间',
  `last_login_ip` bigint(11) unsigned NOT NULL DEFAULT '0' COMMENT '最后一次登录登录IP',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `vmess` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`v` char(3) NOT NULL DEFAULT '',
	`ps` varchar(50) NOT NULL DEFAULT 'remark',
	`add` varchar(200) NOT NULL DEFAULT 'address',
	`port` varchar(10) NOT NULL DEFAULT 'port',
	`uid` varchar(50) NOT NULL DEFAULT 'user id',
	`aid` varchar(10) NOT NULL DEFAULT 'alter id',
	`scy` varchar(10) NOT NULL DEFAULT 'security',
	`net` varchar(10) NOT NULL DEFAULT 'network',
	`type` varchar(50) NOT NULL DEFAULT 'disguise type',
	`host` varchar(256) NOT NULL DEFAULT 'disguise host',
	`path` varchar(50) NOT NULL DEFAULT 'path',
	`tls` varchar(10) NOT NULL DEFAULT 'tls',
	`sni` varchar(50) NOT NULL DEFAULT 'sni',
	`alpn` varchar(10) NOT NULL DEFAULT 'alpn',
	`fp` varchar(50) NOT NULL DEFAULT 'fingerprint',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



