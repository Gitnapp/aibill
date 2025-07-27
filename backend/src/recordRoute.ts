import express from 'express';
import { getRecords } from './db';
import { authMiddleware } from './auth.middleware';

export const recordRoute = express.Router();

recordRoute.post('/', authMiddleware, async (req, res) => {
  const { user_id, date } = req.body;
  // YYYY-MM-DD
  try {

    const records = await getRecords(user_id, date)

    res.status(200).json(
      records
    )
    // 直接返回数组
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      text: 'Internal Server Error'
    })
  }
})