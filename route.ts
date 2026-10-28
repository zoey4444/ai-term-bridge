import { documentHtml } from '../lib/document.mjs';
export async function GET(){return new Response(documentHtml,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
