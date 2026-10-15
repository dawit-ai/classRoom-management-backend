import { and, desc, count, eq, getTableColumns, ilike, or } from "drizzle-orm";
import  express   from "express";
import { departments, subjects } from "../schema/app.js";
import { db } from "../db/db.js";

const router = express.Router();
const MAX_PAGE_SIZE = 100;
router.get("/", async (req, res)=>{
  const {search,departement,page="1",limit="10"} = req.query;
  try {
    const currentPage = parsePositiveInteger(page);
    const requestedLimit = parsePositiveInteger(limit);

    if (currentPage === null || requestedLimit === null) {
      return res.status(400).json({
        message: "page and limit must be positive integer query parameters.",
      });
    }

    const limitPerPage = Math.min(requestedLimit, MAX_PAGE_SIZE);
    const offset = (currentPage - 1) * limitPerPage;
    if (!Number.isSafeInteger(offset)) {
      return res.status(400).json({
        message: "page and limit produce an invalid pagination offset.",
      });
    }

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
    const deptPattern = `%${String(departement).replace(/[%_]/g, "\\$&")}%`;
    filterCondtions.push(
      ilike(departments.name, `%${departement}%`)
    )
   }
   const whereClause = filterCondtions.length>0 ? and(...filterCondtions) : undefined;
   const countResult = await db.select({count: count()})
   .from(subjects)
   .leftJoin(departments,eq(subjects.departmentId,departments.id))
   .where(whereClause)
   const totalCount = countResult[0]?.count ?? 0;
   const subjectsLis = await db.select({ ...getTableColumns(subjects),
    department:{
      ...getTableColumns(departments)
    }
   }).from(subjects)
   .leftJoin(departments,eq(subjects.departmentId,departments.id))
   .where(whereClause)
   .orderBy(desc(subjects.createdAt))
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

function parsePositiveInteger(value: unknown): number | null {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export default router;
