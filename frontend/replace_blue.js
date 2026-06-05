import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  './src/pages/AdminDashboard.jsx',
  './src/components/NotificationBell.jsx',
  './src/components/ChatWindow.jsx'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/blue-/g, 'primary-');
    
    if (content !== newContent) {
      fs.writeFileSync(file, newContent);
      console.log(`Updated ${file}`);
    }
  }
});
