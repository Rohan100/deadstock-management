const fs = require('fs');
const c = fs.readFileSync('src/db/schema.js', 'utf8');
const oldText = 'department: varchar("department", { length: 100 }).notNull(),';
const newText = 'departmentId: integer("department_id")\n      .references(() => departments.departmentId, { onDelete: "set null" }),';
const fixed = c.replace(oldText, newText);
fs.writeFileSync('src/db/schema.js', fixed);
console.log('Contains departmentId:', fixed.includes('departmentId'));
console.log('Still contains old field:', fixed.includes('department: varchar'));
