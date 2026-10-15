import { and, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import  express   from "express";
import { departments, subjects } from "../schema/app.js";
import { db } from "../db/db.js";
const router = express.Router();
router.get("/", async (req, res)=>{
  const {search,departement,page=1,limit=10} = req.query;
  try {
    const currentPage = Math.max(1, Number(page));
    const limitPerPage = Math.max(1, Number(limit));
    const offset = (currentPage - 1) * limitPerPage;
    const filterCondtions=[]
   if(search){
    filterCondtions.push(
      or(
        ilike(subjects.name, `%${search}%`),
        ilike(subjects.code, `%${search}%`)
      )
    )
   }
   if(departement){
    filterCondtions.push(
      ilike(departments.name, `%${departement}%`)
    )
   }
   const whereClause = filterCondtions.length>0 ? and(...filterCondtions) : undefined;
   const countResult = await db.select({count: sql<number>`count(*)`})
   .from(subjects)
   .leftJoin(departments,eq(subjects.departmentId,departments.id))
   .where(whereClause)
   const totalCount = countResult[0]?.count || 0;
   const subjectsLis = await db.select({ ...getTableColumns(subjects),
    department:{
      ...getTableColumns(departments)
    }
   }).from(subjects)
   .leftJoin(departments,eq(subjects.departmentId,departments.id))
   .where(whereClause)
   .limit(limitPerPage)
   .offset(offset)
   res.json({
    subjects:subjectsLis,
    pagination:{
      page:currentPage,
      limit:limitPerPage,
      total:totalCount,
      totalCount:Math.ceil(totalCount/limitPerPage)
    }
  })
  } catch (error) {
    console.error(`get /subject error: ${error}`);
    res.status(500).json({message:"Internal server error"})
  }
})
export default router;