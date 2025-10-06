// src/app/api/auth/[...nextauth]/route.ts (최종 수정)

// 🚨 Node.js 런타임 명시 유지 (Edge Runtime 충돌 방지)
// export const runtime = 'nodejs'; 

import { handlers } from "@/auth";

export const { GET, POST } = handlers; 