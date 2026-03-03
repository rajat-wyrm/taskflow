const { getPool } = require('../config/db');

class Task {
  static async findByUser(userId) {
    try {
      const pool = getPool();
      const result = await pool.query(
        `SELECT id, data, created_at, updated_at 
         FROM tasks 
         WHERE user_id = $1 
         ORDER BY (data->>'createdAt') DESC`,
        [userId]
      );
      
      return result.rows.map(row => ({
        id: row.id,
        ...row.data,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (error) {
      console.error('Error in findByUser:', error);
      throw error;
    }
  }

  static async findById(id, userId) {
    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT id, data, created_at, updated_at FROM tasks WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      return {
        id: row.id,
        ...row.data,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  static async create(taskData, userId) {
    try {
      const pool = getPool();
      
      const data = {
        title: taskData.title || 'Untitled Task',
        description: taskData.description || '',
        category: taskData.category || 'personal',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
        ...taskData
      };
      
      const result = await pool.query(
        `INSERT INTO tasks (user_id, data) 
         VALUES ($1, $2) 
         RETURNING id, data, created_at, updated_at`,
        [userId, data]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        ...row.data,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  static async update(id, updates, userId) {
    try {
      const pool = getPool();
      
      const current = await pool.query(
        'SELECT data FROM tasks WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      
      if (current.rows.length === 0) return null;
      
      const updatedData = {
        ...current.rows[0].data,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const result = await pool.query(
        `UPDATE tasks 
         SET data = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 AND user_id = $3 
         RETURNING id, data, created_at, updated_at`,
        [updatedData, id, userId]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        ...row.data,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  static async delete(id, userId) {
    try {
      const pool = getPool();
      const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
}

module.exports = Task;