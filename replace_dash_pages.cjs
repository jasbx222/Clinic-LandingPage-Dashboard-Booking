const fs = require('fs');
const path = require('path');

const pages = [
  'PatientsPage.tsx',
  'PatientProfile.tsx',
  'AppointmentsPage.tsx',
  'InvoicesPage.tsx',
  'EmployeesPage.tsx',
  'ConsultationScreen.tsx'
];

const dir = path.join(__dirname, 'src', 'pages', 'dashboard');

pages.forEach(page => {
  const name = page.replace('.tsx', '');
  const content = \`import React from 'react';

export default function \${name}() {
  return (
    <div className="p-6 bg-white rounded-3xl shadow-soft">
      <h1 className="text-2xl font-bold text-text mb-4">\${name}</h1>
      <p className="text-muted">هذه الصفحة قيد التطوير وسيتم بناؤها باستخدام Tailwind CSS فقط.</p>
    </div>
  );
}
\`;
  fs.writeFileSync(path.join(dir, page), content);
});

console.log('Placeholders created.');
