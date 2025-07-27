import { createDeepSeek } from '@ai-sdk/deepseek';
import { generateText, streamText } from 'ai';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createRecord } from './db';
import { authMiddleware } from './auth.middleware';

dotenv.config();

export const chatRoutes = express.Router();

const deepSeek = createDeepSeek({  
    apiKey: process.env.DEEPSEEK_API_KEY,
})

const today = new Date().toISOString().split('T')[0]

const prompt = `请你分析我的输入，如果是消费或者支出记录，则按照 json 格式返回，否则正常返回。格式如下：
{
      "title": "others",
      "amount": 100,
      "date": "2025-07-26"
},
规则是：
1. 如果是消费，则 amount 是负数，如果是收入，则 amount 是正数。
2. 如果是支出，则 title 是消费的商品或服务名称，如果是收入，则 title 是收入来源，如果无法确定，则 title 是 "others"。
3. 如果输入是消费或者支出记录，则按照 json 格式返回，否则正常返回。
4. 今天是 ${today}，如果能分析出日期，则 date 是日期，否则为今天。 
`

chatRoutes.post('/', authMiddleware, async (req: Request, res: Response) => {

  const {messages, user_id: userId} = req.body

  let resJson = {
    text: '',
    records: null
  }

  try {

    const {text} = await generateText({
      model: deepSeek('deepseek-chat'),
      system: prompt,
      messages: messages,
    });

    const record = parseResult(text)
    if (record) {
      // save to db
      await createRecord(userId, record.amount, record.title, record.date)
      resJson.records = record
    } else {
      resJson.text = text
    }

      res.status(200).json(resJson);
      return;
  } catch (error) {
    console.log(error)
    res.status(500).json({
      text: '服务器错误',
      records: null
    })
    return;
  }
});

const parseResult = (result: string) => {
  try {
    // 清理可能存在的 Markdown 格式
    const cleanResult = result.replace(/```json/g, '').replace(/```/g, '')
    const parsedResult = JSON.parse(cleanResult)
    if (parsedResult.title && parsedResult.amount && parsedResult.date) {
      return parsedResult
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}