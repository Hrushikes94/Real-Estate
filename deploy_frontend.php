<?php
// Set plain text header for browser readability
header('Content-Type: text/plain');

$src = __DIR__ . '/frontend/out';
$dst = dirname(__DIR__); // Points to public_html/ (the parent of realestate/)

if (!is_dir($src)) {
    die("Error: Source directory '$src' does not exist.\nMake sure you run 'npm run build' locally and push the 'frontend/out/' folder to GitHub first.");
}

echo "Deploying Next.js compiled static files...\n";
echo "Source: " . $src . "\n";
echo "Destination: " . $dst . "\n\n";

// Recursive copy function to overwrite existing files
function recurse_copy($src, $dst) {
    $dir = opendir($src);
    if (!$dir) {
        throw new Exception("Unable to open source directory: " . $src);
    }
    
    // Create destination folder if not exists
    if (!is_dir($dst)) {
        if (!mkdir($dst, 0755, true)) {
            throw new Exception("Unable to create destination directory: " . $dst);
        }
    }
    
    while (false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            if (is_dir($src . '/' . $file)) {
                recurse_copy($src . '/' . $file, $dst . '/' . $file);
            } else {
                if (copy($src . '/' . $file, $dst . '/' . $file)) {
                    echo "Copied: " . str_replace(__DIR__ . '/', '', $src . '/' . $file) . "\n";
                } else {
                    echo "[FAIL] Copy failed: " . $file . "\n";
                }
            }
        }
    }
    closedir($dir);
}

try {
    recurse_copy($src, $dst);
    echo "\n[SUCCESS] Deployment completed! Visit http://yourdesigndcstudio.in/ to view your live site.\n";
} catch (Exception $e) {
    echo "\n[ERROR] Deployment failed: " . $e->getMessage() . "\n";
}
