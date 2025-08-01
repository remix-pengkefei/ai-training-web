const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Database setup
const db = new sqlite3.Database('./ai_training.db');

// Initialize database tables
db.serialize(() => {
  // Create events table
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT,
      location TEXT NOT NULL,
      signupDeadline TEXT NOT NULL,
      highlights TEXT,
      prizes TEXT,
      registeredCount INTEGER DEFAULT 0,
      maxParticipants INTEGER,
      bannerUrl TEXT,
      description TEXT,
      agenda TEXT,
      targetAudience TEXT,
      requirements TEXT,
      speakers TEXT,
      organizer TEXT,
      tags TEXT,
      difficulty TEXT,
      benefits TEXT
    )
  `);

  // Create registrations table
  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId TEXT NOT NULL,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      registeredAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES events(id),
      UNIQUE(eventId, name, department)
    )
  `);

  // 不再自动插入模拟数据
  // db.get("SELECT COUNT(*) as count FROM events", (err, row) => {
  //   if (err) {
  //     console.error('Error checking events count:', err);
  //     return;
  //   }
  //   
  //   if (row.count === 0) {
  //     console.log('No mock data will be inserted');
  //   }
  // });
});

// 在events表中添加replayUrl字段
db.run(`ALTER TABLE events ADD COLUMN replayUrl TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Error adding replayUrl column:', err);
  }
});

// 在events表中添加surveyQuestions字段
db.run(`ALTER TABLE events ADD COLUMN surveyQuestions TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Error adding surveyQuestions column:', err);
  }
});

// API Routes

// Get all events
app.get('/api/events', (req, res) => {
  db.all("SELECT * FROM events ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Parse JSON fields
    const events = rows.map(row => ({
      ...row,
      highlights: row.highlights ? JSON.parse(row.highlights) : [],
      prizes: row.prizes ? JSON.parse(row.prizes) : [],
      surveyQuestions: row.surveyQuestions ? JSON.parse(row.surveyQuestions) : [],
      agenda: row.agenda ? JSON.parse(row.agenda) : null,
      targetAudience: row.targetAudience ? JSON.parse(row.targetAudience) : null,
      requirements: row.requirements ? JSON.parse(row.requirements) : null,
      speakers: row.speakers ? JSON.parse(row.speakers) : null,
      organizer: row.organizer ? JSON.parse(row.organizer) : null,
      tags: row.tags ? JSON.parse(row.tags) : null,
      benefits: row.benefits ? JSON.parse(row.benefits) : null
    }));
    
    res.json(events);
  });
});

// Get event by ID
app.get('/api/events/:id', (req, res) => {
  const { id } = req.params;
  
  db.get("SELECT * FROM events WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    // Parse JSON fields
    const event = {
      ...row,
      highlights: row.highlights ? JSON.parse(row.highlights) : [],
      prizes: row.prizes ? JSON.parse(row.prizes) : [],
      surveyQuestions: row.surveyQuestions ? JSON.parse(row.surveyQuestions) : [],
      agenda: row.agenda ? JSON.parse(row.agenda) : null,
      targetAudience: row.targetAudience ? JSON.parse(row.targetAudience) : null,
      requirements: row.requirements ? JSON.parse(row.requirements) : null,
      speakers: row.speakers ? JSON.parse(row.speakers) : null,
      organizer: row.organizer ? JSON.parse(row.organizer) : null,
      tags: row.tags ? JSON.parse(row.tags) : null,
      benefits: row.benefits ? JSON.parse(row.benefits) : null
    };
    
    res.json(event);
  });
});

// Register for event
app.post('/api/events/:id/register', (req, res) => {
  const { id } = req.params;
  const { name, department } = req.body;
  
  if (!name || !department) {
    res.status(400).json({ error: 'Name and department are required' });
    return;
  }
  
  // Start transaction
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    
    // Insert registration
    db.run(
      "INSERT INTO registrations (eventId, name, department) VALUES (?, ?, ?)",
      [id, name, department],
      function(err) {
        if (err) {
          db.run("ROLLBACK");
          if (err.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ 
              success: false, 
              message: '您已经报名过该活动',
              registeredCount: 0
            });
          } else {
            res.status(500).json({ 
              success: false, 
              message: '报名失败，请稍后重试',
              registeredCount: 0
            });
          }
          return;
        }
        
        // Update registered count
        db.run(
          "UPDATE events SET registeredCount = registeredCount + 1 WHERE id = ?",
          [id],
          function(updateErr) {
            if (updateErr) {
              db.run("ROLLBACK");
              res.status(500).json({ 
                success: false, 
                message: '报名失败，请稍后重试',
                registeredCount: 0
              });
              return;
            }
            
            // Get updated count
            db.get(
              "SELECT registeredCount FROM events WHERE id = ?",
              [id],
              (selectErr, row) => {
                if (selectErr || !row) {
                  db.run("ROLLBACK");
                  res.status(500).json({ 
                    success: false, 
                    message: '报名失败，请稍后重试',
                    registeredCount: 0
                  });
                  return;
                }
                
                db.run("COMMIT");
                res.json({ 
                  success: true, 
                  registeredCount: row.registeredCount
                });
              }
            );
          }
        );
      }
    );
  });
});

// Get registrations for an event
app.get('/api/events/:id/registrations', (req, res) => {
  const { id } = req.params;
  
  db.all(
    "SELECT * FROM registrations WHERE eventId = ? ORDER BY registeredAt DESC",
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Create new event
app.post('/api/events', (req, res) => {
  console.log('POST /api/events - Request body:', req.body);
  const { title, startTime, location, signupDeadline, highlights, prizes, description, maxParticipants, replayUrl, bannerUrl, surveyQuestions } = req.body;
  
  if (!title || !startTime || !location || !signupDeadline) {
    console.log('Missing required fields:', { title: !!title, startTime: !!startTime, location: !!location, signupDeadline: !!signupDeadline });
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  const id = Date.now().toString();
  
  db.run(
    `INSERT INTO events (id, title, startTime, location, signupDeadline, highlights, prizes, description, maxParticipants, replayUrl, bannerUrl, surveyQuestions, registeredCount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      title,
      startTime,
      location,
      signupDeadline,
      JSON.stringify(highlights || []),
      JSON.stringify(prizes || []),
      description,
      maxParticipants,
      replayUrl,
      bannerUrl,
      JSON.stringify(surveyQuestions || []),
      0
    ],
    function(err) {
      if (err) {
        console.error('Failed to create event:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      
      console.log(`Event created successfully with ID: ${id}`);
      db.get("SELECT * FROM events WHERE id = ?", [id], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        const event = {
          ...row,
          highlights: row.highlights ? JSON.parse(row.highlights) : [],
          prizes: row.prizes ? JSON.parse(row.prizes) : [],
          surveyQuestions: row.surveyQuestions ? JSON.parse(row.surveyQuestions) : []
        };
        
        res.status(201).json(event);
      });
    }
  );
});

// Update event
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Build update query dynamically
  const fields = [];
  const values = [];
  
  Object.keys(updates).forEach(key => {
    if (key !== 'id' && key !== 'registeredCount') {
      fields.push(`${key} = ?`);
      
      // JSON stringify arrays
      if (key === 'highlights' || key === 'prizes' || key === 'surveyQuestions') {
        values.push(JSON.stringify(updates[key]));
      } else {
        values.push(updates[key]);
      }
    }
  });
  
  if (fields.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }
  
  values.push(id);
  
  db.run(
    `UPDATE events SET ${fields.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      
      db.get("SELECT * FROM events WHERE id = ?", [id], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        const event = {
          ...row,
          highlights: row.highlights ? JSON.parse(row.highlights) : [],
          prizes: row.prizes ? JSON.parse(row.prizes) : [],
          surveyQuestions: row.surveyQuestions ? JSON.parse(row.surveyQuestions) : []
        };
        
        res.json(event);
      });
    }
  );
});

// Upload image endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// Delete event
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    
    // Delete registrations first
    db.run("DELETE FROM registrations WHERE eventId = ?", [id], (err) => {
      if (err) {
        db.run("ROLLBACK");
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Delete event
      db.run("DELETE FROM events WHERE id = ?", [id], function(err) {
        if (err) {
          db.run("ROLLBACK");
          res.status(500).json({ error: err.message });
          return;
        }
        
        if (this.changes === 0) {
          db.run("ROLLBACK");
          res.status(404).json({ error: 'Event not found' });
          return;
        }
        
        db.run("COMMIT");
        res.status(204).send();
      });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});