CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `email` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户真实微信号',
  `password` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
  `thumb` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '头像',
  `last_login_at` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最后一次登录登录时间',
  `last_login_ip` bigint(11) unsigned NOT NULL DEFAULT '0' COMMENT '最后一次登录登录IP',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态',
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
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'user table id',
  `host_ip` varchar(32) NOT NULL DEFAULT '' COMMENT 'v2ray host ip address',
	`v` char(3) NOT NULL DEFAULT '' COMMENT 'vmess version',
	`ps` varchar(50) NOT NULL DEFAULT '' COMMENT 'remark',
	`add` varchar(200) NOT NULL DEFAULT '' COMMENT 'address',
	`port` varchar(10) NOT NULL DEFAULT '' COMMENT 'port',
	`uid` varchar(50) NOT NULL DEFAULT '' COMMENT 'user id',
	`aid` varchar(10) NOT NULL DEFAULT '' COMMENT 'alter id',
	`scy` varchar(10) NOT NULL DEFAULT '' COMMENT 'security',
	`net` varchar(10) NOT NULL DEFAULT '' COMMENT 'network',
	`type` varchar(50) NOT NULL DEFAULT '' COMMENT 'disguise type',
	`host` varchar(256) NOT NULL DEFAULT '' COMMENT 'disguise host',
	`path` varchar(50) NOT NULL DEFAULT '' COMMENT 'path',
	`tls` varchar(10) NOT NULL DEFAULT '' COMMENT 'tls',
	`sni` varchar(50) NOT NULL DEFAULT '' COMMENT 'sni',
	`alpn` varchar(10) NOT NULL DEFAULT '' COMMENT 'alpn',
	`fp` varchar(50) NOT NULL DEFAULT '' COMMENT 'fingerprint',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



