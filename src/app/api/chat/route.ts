import 'dotenv/config'
import { mainfunction } from "../../../components/chat.js"

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await mainfunction(messages[0].content);
  return Response.json({ response });
}
