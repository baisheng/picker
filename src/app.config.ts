/**
 * App config.
 * @file 应用运行配置
 * @module app/config
 */

import * as path from 'path';
import { argv } from 'yargs';
// import { packageJson } from '@app/transforms/module.transform';

export const APP = {
  LIMIT: 16,
  PORT: 80,
  ROOT_PATH: __dirname,
  NAME: 'Picker',
  URL: 'https://picker.cc',
  FRONT_END_PATH: path.join(__dirname, '..', '..', 'picker.cc'),
};

export const CROSS_DOMAIN = {
  allowedOrigins: ['https://picker.cc', 'https://cdn.picker.cc', 'https://admin.picker.cc'],
  allowedReferer: 'picker.cc',
};

export const REDIS = {
  host: argv.redis_host || 'redis',
  port: argv.redis_port || 6379,
  ttl: null,
  defaultCacheTTL: 60 * 60 * 24,
};

export const AUTH = {
  expiresIn: argv.auth_expires_in || 3600,
  data: argv.auth_data || { user: 'root' },
  // jwtTokenSecret: argv.auth_key || 'picker',
  jwtTokenSecret: argv.auth_key || 'picker',
  defaultPassword: argv.auth_default_password || 'root',
};

export const EMAIL = {
  account: argv.email_account || 'your email address like : i@picker.cc',
  password: argv.email_password || 'your email password',
  from: '"Baisheng" <i@baisheng.me>',
  admin: 'admin@admin.com',
};

export const ALIYUN = {
  ip: argv.aliyun_ip_auth,
};

export const BAIDU = {
  site: argv.baidu_site || 'your baidu site domain',
  token: argv.baidu_token || 'your baidu seo push token',
};

export const GOOGLE = {
  serverAccountFilePath: path.resolve(__dirname, '..', 'classified', 'google_service_account.json'),
};

export const QINIU = {
  accessKey: argv.qn_accessKey || 'qiniu access key',
  secretKey: argv.qn_secretKey || 'qiniu secret key',
  bucket: argv.qn_bucket || 'qiniu bucket name',
  origin: argv.qn_origin || 'qiniu origin url',
  uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/',
};

export const DB_BACKUP = {
  accessKey: argv.db_backup_qn_accessKey as string || 'dbbackup qiniu access key',
  secretKey: argv.db_backup_qn_secretKey as string || 'dbbackup qiniu secret key',
  bucket: argv.db_backup_qn_bucket as string || 'dbbackup qiniu bucket name',
  backupShellPath: argv.db_backup_shell_path as string || '/example/path/to/xxx/dbbackup.sh',
  backupFilePath: argv.db_backup_file_path as string || '/example/path/to/xxx/dbbackups/',
};

export const INFO = {
  name: 'picker',
  version: '0.1',
  author: 'baisheng',
  // name: packageJson.name,
  // version: packageJson.version,
  // author: packageJson.author,
  site: APP.URL,
  homepage: 'picker.cc',
  // homepage: packageJson.homepage,
  powered: ['Vue', 'nestjs', 'Nodejs', 'MySQL', 'Express', 'Nginx'],
};
