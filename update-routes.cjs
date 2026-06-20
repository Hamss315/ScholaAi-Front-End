const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace navigate paths in back buttons
    content = content.replace(/navigate\("\/student\/dashboard"\)/g, 'navigate(-1)');
    content = content.replace(/navigate\("\/teacher\/dashboard"\)/g, 'navigate(-1)');
    
    // Replace 'Back to Dashboard' text
    content = content.replace(/>\s*Back to Dashboard\s*<\//g, '>Back</');
    content = content.replace(/Back to Dashboard/g, 'Back');
    
    // Revert the ones that shouldn't be navigate(-1), like the success redirects!
    // In TeacherPayoutPage.tsx, we had a setTimeout that navigates to the dashboard:
    if (filePath.includes('TeacherPayoutPage.tsx')) {
      content = content.replace(/navigate\(-1\);\s*},\s*2500\);/g, 'navigate("/teacher/dashboard");\n    }, 2500);');
    }
    
    if (filePath.includes('SessionAnalysisPage.tsx')) {
      content = content.replace(/const handleBackToDashboard = \(\) => {\n\s*\/\/.+\n\s*navigate\(-1\);\n\s*};/g, 'const handleBack = () => {\n    navigate(-1);\n  };');
      content = content.replace(/onClick=\{handleBackToDashboard\}/g, 'onClick={handleBack}');
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated: ' + filePath);
    }
  }
});
