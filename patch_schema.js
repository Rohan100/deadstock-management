const fs = require('fs');
let c = fs.readFileSync('src/db/schema.js', 'utf8');
const oldText = 'department: varchar("department", { length: 100 }).notNull(),';
const newText = 'departmentId: integer("department_id")\r\n      .references(() => departments.departmentId, { onDelete: "set null" }),';
c = c.replace(oldText, newText);
fs.writeFileSync('src/db/schema.js', c);
console.log('Done. Contains departmentId:', c.includes('departmentId'));
