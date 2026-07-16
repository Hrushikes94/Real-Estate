<?php
require_once __DIR__ . '/db.php';

// Set simple text header for CLI run readability
if (php_sapi_name() === 'cli') {
    header('Content-Type: text/plain');
}

try {
    $pdo = getDbConnection();
    echo "Connected to database for seeding...\n";

    // Disable foreign key checks to safely rebuild tables
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

    // Drop existing tables
    echo "Dropping old tables...\n";
    $pdo->exec("DROP TABLE IF EXISTS inquiries");
    $pdo->exec("DROP TABLE IF EXISTS properties");
    $pdo->exec("DROP TABLE IF EXISTS agents");
    $pdo->exec("DROP TABLE IF EXISTS users");

    // Recreate tables
    echo "Creating database tables...\n";
    
    $pdo->exec("CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin'
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE agents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bio TEXT NOT NULL,
        photo VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        images TEXT, 
        beds INT NOT NULL,
        baths INT NOT NULL,
        sqft INT NOT NULL,
        type VARCHAR(100) NOT NULL,
        status VARCHAR(100) NOT NULL,
        agentId INT,
        FOREIGN KEY (agentId) REFERENCES agents(id) ON DELETE SET NULL
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        propertyId INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE SET NULL
    ) ENGINE=InnoDB");

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

    // Seed default administrator login credentials
    echo "Seeding default admin credentials...\n";
    $passwordHash = password_hash('admin123', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
    $stmt->execute(['admin', $passwordHash, 'admin']);

    // Seed agent profiles
    echo "Seeding agents...\n";
    $agents = [
        [
            'Alexander Vance',
            'With over 12 years of experience in ultra-high-net-worth estate transactions, Alexander specializes in architectural landmarks and coastal penthouses.',
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
            'alexander@gravityestates.com',
            '+1 (555) 302-8821'
        ],
        [
            'Elena Rostova',
            'Elena is a leading specialist in contemporary minimalist residences. Her background in interior architecture provides clients with unrivaled design curation.',
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
            'elena@gravityestates.com',
            '+1 (555) 302-8822'
        ],
        [
            'Marcus Sterling',
            'Marcus has built his reputation on discreet, off-market transactions in historic luxury districts. His clients appreciate his precise financial valuations and absolute discretion.',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
            'marcus@gravityestates.com',
            '+1 (555) 302-8823'
        ]
    ];

    $agentIds = [];
    $stmt = $pdo->prepare("INSERT INTO agents (name, bio, photo, email, phone) VALUES (?, ?, ?, ?, ?)");
    foreach ($agents as $agent) {
        $stmt->execute($agent);
        $agentIds[] = $pdo->lastInsertId();
    }
    echo count($agentIds) . " agents seeded.\n";

    // Seed luxury property listings
    echo "Seeding properties...\n";
    $properties = [
        [
            'The Obsidian Pavilion',
            'A minimalist concrete masterpiece built into the sheer cliffside. Features absolute floor-to-ceiling glass paneling, a 25-meter black quartz infinity pool, smart-home automation, subterranean garage, and uninterrupted views of the Pacific coastline.',
            18500000.00,
            'Malibu, CA',
            implode(',', [
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
            ]),
            5, 6, 8400, 'Villa', 'Buy', $agentIds[0]
        ],
        [
            'Aura Heights Penthouse',
            'Exquisite dual-level penthouse sitting atop the city skyline. Features a private glass elevator, sweeping double-height lounge, architectural floating staircase, wraparound terrace with hot tub, and direct private access to downtown cultural landmarks.',
            9200000.00,
            'New York, NY',
            implode(',', [
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            ]),
            3, 4, 4200, 'Penthouse', 'Buy', $agentIds[1]
        ],
        [
            'Sienna Ridge Residence',
            'An earth-toned retreat inspired by Italian rural estates, redesigned for modern editorial living. Composed of reclaimed stone and oak beams, featuring custom minimalist millwork, an olive grove garden, open-air pavilion, and full service wellness spa.',
            12400000.00,
            'Napa Valley, CA',
            implode(',', [
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
            ]),
            4, 5, 6700, 'Villa', 'Buy', $agentIds[2]
        ],
        [
            'Concrete Brutalist Loft',
            'Raw concrete panels, industrial ceiling height, and minimalist layout. Perfect for galleries or modern lifestyle creatives. Positioned in the art district with high-security private entry, steel framed window structures, and architectural solar panels.',
            3400000.00,
            'Portland, OR',
            implode(',', [
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=80'
            ]),
            2, 2, 3100, 'Apartment', 'Rent', $agentIds[1]
        ],
        [
            'Elysian Estate Residence',
            'Surrounded by ancient redwoods, this steel-frame architectural design bridges nature and ultra-luxury living. Double-tier heated pool deck, indoor waterfall feature, home theater, guest house, and biometric security systems throughout.',
            24500000.00,
            'Aspen, CO',
            implode(',', [
                'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'
            ]),
            6, 8, 11200, 'Villa', 'Sold', $agentIds[0]
        ]
    ];

    $stmt = $pdo->prepare("INSERT INTO properties (title, description, price, location, images, beds, baths, sqft, type, status, agentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($properties as $prop) {
        $stmt->execute($prop);
    }
    echo "Properties seeded successfully.\n";
    echo "Database seeding completed successfully.\n";

} catch (PDOException $e) {
    echo "Seeding failed: " . $e->getMessage() . "\n";
}
