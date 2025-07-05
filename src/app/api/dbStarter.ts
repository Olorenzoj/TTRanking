import {NextApiRequest, NextApiResponse} from "next"
import prisma from '@/lib/prisma'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    try {
        await prisma.$queryRaw`SELECT 1;`
        res.status(200).json({success: true})

    } catch (error){
        console.error('DB CONNECTION ERROR:', error)
        res.status(500).json({success: false, message: 'Database Not Available'})
    } finally {
        await prisma.$disconnect()
    }
}