import type { Metadata } from 'next';
export const metadata:Metadata={title:'AI 术语桥',description:'用你熟悉的世界理解 AI。'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>;}
