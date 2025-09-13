<?php

const DB_DRIVER = "mysql",
DB_HOST = "localhost",
DB_LOGIN = "root",
DB_PWD = "",
DB_NAME = "isp_main",
DB_PORT = 3306,
DB_CHARSET = "utf8mb4",
DB_OPTIONS = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC];

const PROJECT_DIRECTORY = __DIR__,
PUB_DIR = '../public/';

const ENV_MODE = "DEV";