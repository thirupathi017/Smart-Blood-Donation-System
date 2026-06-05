import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/(rose|sky|indigo)-/g, 'primary-');
  
  // Custom fix for Home.jsx guest gradient that used blue and red
  if (file.endsWith('Home.jsx')) {
    newContent = newContent.replace(/bg-blue-/g, 'bg-primary-')
                           .replace(/text-blue-/g, 'text-primary-')
                           .replace(/shadow-blue-/g, 'shadow-primary-')
                           .replace(/bg-red-/g, 'bg-primary-')
                           .replace(/text-red-/g, 'text-primary-')
                           .replace(/shadow-red-/g, 'shadow-primary-')
                           .replace(/from-red-/g, 'from-primary-');
  }

  // Custom fix for ReceiverDashboard.jsx header gradient
  if (file.endsWith('ReceiverDashboard.jsx')) {
    newContent = newContent.replace(/blue-600/g, 'primary-600')
                           .replace(/blue-800/g, 'primary-800');
  }
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
