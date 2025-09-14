const dbName = process.env.APP_DB_NAME || 'employees';
const user = process.env.APP_DB_USERNAME || 'appuser';
const pass = process.env.APP_DB_PASSWORD || 'pass';
const appDb = db.getSiblingDB(dbName);
appDb.createUser({ user, pwd: pass, roles: [{ role: 'readWrite', db: dbName }] });

print('Created App User \'' + user + '\' successfully on database \'' + dbName + '\'');